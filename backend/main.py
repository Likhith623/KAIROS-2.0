from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sympy as sp
import networkx as nx
from sympy.parsing.sympy_parser import parse_expr
import json
import google.generativeai as genai
import base64
from PIL import Image
import io

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyAHWWbsXYCO6N11bBf_rkQiTuZaQ9zsY4A"
genai.configure(api_key=GEMINI_API_KEY)
# Use Gemini 2.0 Flash - lowest cost, fastest model
gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')

app = FastAPI(title="KAIROS 2.0 Backend API", version="2.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConceptRequest(BaseModel):
    object_class: str
    confidence: float
    context: str = ""


class ConceptResponse(BaseModel):
    concepts: List[Dict[str, Any]]
    overlays: List[Dict[str, Any]]
    modules: List[Dict[str, Any]]
    web_info: Optional[Dict[str, Any]] = None


# Knowledge base mapping objects to scientific concepts
CONCEPT_DATABASE = {
    "plant": {
        "concepts": [
            {
                "name": "Photosynthesis",
                "category": "biology",
                "formulas": ["6CO2 + 6H2O + light → C6H12O6 + 6O2"],
                "overlays": [
                    {"type": "flow", "from": "CO2", "to": "O2", "color": "green"},
                    {"type": "label", "text": "Blade", "position": "top", "color": "#00ff00"},
                    {"type": "label", "text": "Petiole", "position": "middle", "color": "#88ff00"},
                    {"type": "label", "text": "Base", "position": "bottom", "color": "#66ff00"},
                    {"type": "label", "text": "Stoma", "position": "right", "color": "#44ff00"},
                    {"type": "label", "text": "Chloroplast", "position": "center", "color": "#22ff00"},
                    {"type": "arrow", "direction": "down", "label": "H₂O Uptake", "color": "#0088ff"},
                    {"type": "arrow", "direction": "up", "label": "O₂ Release", "color": "#00ff88"},
                    {"type": "particles", "movement": "random", "color": "rgba(0,255,0,0.4)", "label": "CO₂"},
                ]
            },
            {
                "name": "Diffusion",
                "category": "chemistry",
                "formulas": ["J = -D * (dC/dx)"],
                "overlays": [
                    {"type": "particles", "movement": "random", "color": "blue"},
                    {"type": "gradient", "from": "high", "to": "low"}
                ]
            },
            {
                "name": "Osmosis",
                "category": "biology",
                "formulas": ["π = iMRT"],
                "overlays": [
                    {"type": "membrane", "semipermeable": True},
                    {"type": "flow", "substance": "water", "direction": "in"}
                ]
            }
        ]
    },
    "bicycle": {
        "concepts": [
            {
                "name": "Torque",
                "category": "physics",
                "formulas": ["τ = r × F", "τ = I * α"],
                "overlays": [
                    {"type": "vector", "from": "pedal", "rotation": True, "color": "red"},
                    {"type": "label", "text": "Pedal", "position": "bottom-left", "color": "#ff0000"},
                    {"type": "label", "text": "Crank Arm", "position": "left", "color": "#ff4400"},
                    {"type": "label", "text": "Chain", "position": "middle", "color": "#ff8800"},
                    {"type": "label", "text": "Wheel", "position": "bottom-right", "color": "#ffcc00"},
                    {"type": "label", "text": "Frame", "position": "top", "color": "#ff00ff"},
                    {"type": "label", "text": "Handlebar", "position": "top-left", "color": "#8800ff"},
                    {"type": "arc", "radius": "r", "force": "F"},
                    {"type": "label", "text": "τ = r × F", "position": "pedal"}
                ]
            },
            {
                "name": "Angular Momentum",
                "category": "physics",
                "formulas": ["L = I * ω", "L = r × p"],
                "overlays": [
                    {"type": "rotation", "axis": "wheel", "color": "purple"},
                    {"type": "vector", "circular": True, "label": "ω"}
                ]
            },
            {
                "name": "Mechanical Advantage",
                "category": "physics",
                "formulas": ["MA = output force / input force", "MA = r2 / r1"],
                "overlays": [
                    {"type": "gear_ratio", "input": "pedal", "output": "wheel"},
                    {"type": "label", "text": "Gear Ratio", "position": "chain"}
                ]
            },
            {
                "name": "Friction",
                "category": "physics",
                "formulas": ["f = μ * N"],
                "overlays": [
                    {"type": "heatmap", "zones": ["tire", "brake"], "color": "orange"},
                    {"type": "vector", "direction": "opposite", "label": "Friction Force"}
                ]
            }
        ]
    },
    "bottle": {
        "concepts": [
            {
                "name": "Volume & Surface Area",
                "category": "geometry",
                "formulas": ["V = π * r² * h", "SA = 2πr² + 2πrh"],
                "overlays": [
                    {"type": "dimension", "labels": ["r", "h"], "color": "cyan"},
                    {"type": "label", "text": "Cap/Lid", "position": "top", "color": "#00ffff"},
                    {"type": "label", "text": "Neck", "position": "top-middle", "color": "#00ccff"},
                    {"type": "label", "text": "Body", "position": "center", "color": "#0099ff"},
                    {"type": "label", "text": "Base", "position": "bottom", "color": "#0066ff"},
                    {"type": "label", "text": "Height (h)", "position": "right", "color": "#ffff00"},
                    {"type": "label", "text": "Radius (r)", "position": "bottom", "color": "#ffff00"},
                    {"type": "highlight", "area": "surface", "opacity": 0.3}
                ]
            },
            {
                "name": "Pressure",
                "category": "physics",
                "formulas": ["P = F / A", "P = ρgh"],
                "overlays": [
                    {"type": "stress_points", "color": "red", "intensity": "high"},
                    {"type": "gradient", "from": "bottom", "to": "top", "label": "Pressure"}
                ]
            },
            {
                "name": "Material Properties",
                "category": "engineering",
                "formulas": ["σ = E * ε"],
                "overlays": [
                    {"type": "material_highlight", "property": "elasticity"},
                    {"type": "label", "text": "Stress Points", "critical_zones": True}
                ]
            }
        ]
    },
    "ball": {
        "concepts": [
            {
                "name": "Projectile Motion",
                "category": "physics",
                "formulas": ["y = x*tan(θ) - (g*x²)/(2*v₀²*cos²(θ))", "R = (v₀²*sin(2θ))/g"],
                "overlays": [
                    {"type": "trajectory", "path": "parabolic", "color": "yellow"},
                    {"type": "vector", "components": ["vx", "vy"], "decompose": True},
                    {"type": "label", "text": "Panels", "position": "center", "color": "#ff8800"},
                    {"type": "label", "text": "Valve", "position": "right", "color": "#ff4400"},
                    {"type": "label", "text": "Seam", "position": "left", "color": "#ff0000"},
                    {"type": "label", "text": "Surface", "position": "top", "color": "#ffcc00"},
                    {"type": "arrow", "direction": "down", "label": "Gravity (g)", "color": "#ff0000"}
                ]
            },
            {
                "name": "Elastic Collision",
                "category": "physics",
                "formulas": ["½mv₁² + ½mv₂² = ½mv₁'² + ½mv₂'²"],
                "overlays": [
                    {"type": "impact_zone", "color": "red"},
                    {"type": "energy_transfer", "visual": "wave"}
                ]
            }
        ]
    },
    "car": {
        "concepts": [
            {
                "name": "Newton's Laws",
                "category": "physics",
                "formulas": ["F = ma", "F₁₂ = -F₂₁"],
                "overlays": [
                    {"type": "force_diagram", "vectors": ["weight", "normal", "friction"]},
                    {"type": "acceleration_arrow", "color": "green"},
                    {"type": "label", "text": "Engine", "position": "front", "color": "#ff0000"},
                    {"type": "label", "text": "Wheels", "position": "bottom", "color": "#ffff00"},
                    {"type": "label", "text": "Chassis", "position": "center", "color": "#00ff00"},
                    {"type": "label", "text": "Doors", "position": "left", "color": "#00ffff"},
                    {"type": "label", "text": "Headlights", "position": "front-top", "color": "#ffffff"},
                    {"type": "label", "text": "Windshield", "position": "top", "color": "#0088ff"},
                    {"type": "vector", "name": "Acceleration", "direction": "forward", "color": "#00ff00"},
                    {"type": "arrow", "direction": "down", "label": "Friction", "color": "#ff0000"}
                ]
            },
            {
                "name": "Thermodynamics",
                "category": "physics",
                "formulas": ["η = W/Qh", "PV = nRT"],
                "overlays": [
                    {"type": "heat_flow", "from": "engine", "color": "red"},
                    {"type": "label", "text": "Combustion", "position": "engine"}
                ]
            }
        ]
    },
    "toothbrush": {
        "concepts": [
            {
                "name": "Structure & Mechanics",
                "category": "engineering",
                "formulas": ["Pressure = Force / Area", "Cleaning Efficiency = Bristle Contact × Motion"],
                "overlays": [
                    {"type": "label", "text": "Bristles", "position": "right", "color": "#00ffff"},
                    {"type": "label", "text": "Brush Head", "position": "top-right", "color": "#00ccff"},
                    {"type": "label", "text": "Neck", "position": "center", "color": "#0099ff"},
                    {"type": "label", "text": "Handle", "position": "left", "color": "#0066ff"},
                    {"type": "label", "text": "Grip Area", "position": "bottom-left", "color": "#0033ff"},
                    {"type": "arrow", "direction": "right", "label": "Brushing Motion", "color": "#ffff00"},
                    {"type": "arrow", "direction": "down", "label": "Applied Pressure", "color": "#ff8800"},
                    {"type": "label", "text": "Contact Surface", "position": "top", "color": "#ff00ff"},
                    {"type": "particles", "label": "Bacteria Removal", "movement": "random", "color": "rgba(255, 0, 0, 0.6)"}
                ]
            },
            {
                "name": "Material Science",
                "category": "chemistry",
                "formulas": ["Nylon Properties", "Elasticity = Stress / Strain"],
                "overlays": [
                    {"type": "label", "text": "Nylon Bristles", "position": "right", "color": "#00ff00"},
                    {"type": "label", "text": "Plastic Handle", "position": "left", "color": "#ffaa00"}
                ]
            }
        ]
    }
}

# Expanded topic catalog (Math / Physics / Chemistry) with notes and external Byju's links
def byjus_search_link(topic_name: str) -> str:
    # Simple link to Byju's search for the topic (safe fallback)
    return f"https://www.byjus.com/search/?q={topic_name.replace(' ', '+')}"

TOPICS_DATABASE = {
    "math": [
        {
            "name": "Algebra - Linear Equations",
            "category": "math",
            "notes": "Linear equations, methods of solution, graphing lines, systems of equations.",
            "formulas": ["ax + b = 0", "y = mx + c"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("linear equations")
        },
        {
            "name": "Algebra - Quadratic Equations",
            "category": "math",
            "notes": "Standard form ax^2 + bx + c = 0, factoring, completing the square, quadratic formula.",
            "formulas": ["x = (-b ± sqrt(b^2 - 4ac)) / (2a)"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("quadratic equations")
        },
        {
            "name": "Calculus - Derivatives",
            "category": "math",
            "notes": "Rate of change, differentiation rules (product, quotient, chain), applications to maxima/minima.",
            "formulas": ["d/dx x^n = n x^{n-1}"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("derivative")
        },
        {
            "name": "Calculus - Integrals",
            "category": "math",
            "notes": "Antiderivatives, definite and indefinite integrals, area under curve, fundamental theorem of calculus.",
            "formulas": ["∫ x^n dx = x^{n+1} / (n+1) + C"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("integrals")
        },
        {
            "name": "Trigonometry",
            "category": "math",
            "notes": "Sine, cosine, tangent, identities, unit circle, solving triangles.",
            "formulas": ["sin^2 θ + cos^2 θ = 1", "tan θ = sin θ / cos θ"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("trigonometry")
        },
        {
            "name": "Probability & Statistics",
            "category": "math",
            "notes": "Basic probability, combinatorics, mean/median/mode, standard deviation.",
            "formulas": ["P(A) = favorable / total"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("probability")
        }
    ],
    "physics": [
        {
            "name": "Kinematics",
            "category": "physics",
            "notes": "Motion in one and two dimensions, velocity, acceleration, equations of motion.",
            "formulas": ["v = u + at", "s = ut + 1/2 a t^2"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("kinematics")
        },
        {
            "name": "Dynamics & Newton's Laws",
            "category": "physics",
            "notes": "Force, mass, acceleration, free-body diagrams, friction, circular motion.",
            "formulas": ["F = ma", "τ = r × F"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("newton's laws")
        },
        {
            "name": "Energy & Work",
            "category": "physics",
            "notes": "Kinetic/potential energy, work-energy theorem, conservation of energy.",
            "formulas": ["KE = 1/2 mv^2", "W = F · d"],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("work and energy")
        },
        {
            "name": "Thermodynamics",
            "category": "physics",
            "notes": "Laws of thermodynamics, heat transfer, ideal gases, PV diagrams.",
            "formulas": ["PV = nRT", "ΔU = Q - W"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("thermodynamics")
        },
        {
            "name": "Electricity & Magnetism",
            "category": "physics",
            "notes": "Coulomb's law, electric fields, circuits, magnetic fields, Faraday's law.",
            "formulas": ["V = IR", "∇ × E = -∂B/∂t"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("electricity and magnetism")
        }
    ],
    "chemistry": [
        {
            "name": "Atomic Structure",
            "category": "chemistry",
            "notes": "Protons, neutrons, electrons, electronic configuration, isotopes.",
            "formulas": [],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("atomic structure")
        },
        {
            "name": "Periodic Table",
            "category": "chemistry",
            "notes": "Trends across periods/groups: electronegativity, atomic radius, ionization energy.",
            "formulas": [],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("periodic table")
        },
        {
            "name": "Chemical Bonding",
            "category": "chemistry",
            "notes": "Ionic, covalent, metallic bonding, polarity, VSEPR shapes.",
            "formulas": [],
            "difficulty": "beginner",
            "byjus_link": byjus_search_link("chemical bonding")
        },
        {
            "name": "Stoichiometry",
            "category": "chemistry",
            "notes": "Balancing equations, mole concept, limiting reagent, yield calculations.",
            "formulas": [],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("stoichiometry")
        },
        {
            "name": "Chemical Kinetics",
            "category": "chemistry",
            "notes": "Reaction rates, order of reaction, rate laws, activation energy.",
            "formulas": ["rate = k [A]^n"],
            "difficulty": "intermediate",
            "byjus_link": byjus_search_link("chemical kinetics")
        }
    ]
}


async def get_object_web_info(object_name: str) -> Dict[str, Any]:
    """Get real-time web information about an object using Gemini"""
    prompt = f"""Provide educational information about: {object_name}

Return a JSON object with:
- description: 2-3 sentence overview of what it is and its purpose
- key_facts: Array of 3-5 interesting facts
- scientific_principles: Array of 2-3 scientific concepts related to it
- fun_fact: One interesting trivia

Return ONLY valid JSON:
{{"description":"...","key_facts":["..."],"scientific_principles":["..."],"fun_fact":"..."}}"""

    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean markdown
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Find JSON in response
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx+1]
        
        info = json.loads(text)
        return info
    except Exception as e:
        print(f"❌ Error getting web info for {object_name}: {e}")
        return {
            "description": f"A {object_name} detected by the system.",
            "key_facts": ["Object successfully identified"],
            "scientific_principles": ["Object detection using machine learning"],
            "fun_fact": "AI can recognize thousands of objects!"
        }


@app.get("/")
async def root():
    return {
        "message": "KAIROS 2.0 Backend API",
        "version": "2.0.0",
        "status": "active"
    }


@app.post("/api/extract-concepts", response_model=ConceptResponse)
async def extract_concepts(request: ConceptRequest):
    """
    Extract scientific concepts from detected objects with web search info
    """
    object_class = request.object_class.lower()
    
    # First try to find in static database
    concepts_data = CONCEPT_DATABASE.get(object_class, None)
    
    # If not found, try to generate using Gemini
    if not concepts_data:
        print(f"🤖 Generating AR overlays for '{object_class}' using Gemini...")
        try:
            gemini_config = await generate_ar_overlays_gemini(object_class)
            if gemini_config and gemini_config.get("concepts"):
                concepts_data = gemini_config
                print(f"✅ Generated {len(gemini_config['concepts'])} concepts for {object_class}")
            else:
                # Fallback for unknown objects
                concepts_data = {
                    "concepts": [
                        {
                            "name": "Structure & Form",
                            "category": "general",
                            "formulas": [],
                            "overlays": [
                                {"type": "outline", "color": "white"},
                                {"type": "label", "text": "Object Detected", "position": "top", "color": "#00ff00"}
                            ]
                        }
                    ]
                }
        except Exception as e:
            print(f"❌ Failed to generate AR overlays: {e}")
            concepts_data = {
                "concepts": [
                    {
                        "name": "Structure & Form",
                        "category": "general",
                        "formulas": [],
                        "overlays": [
                            {"type": "outline", "color": "white"},
                            {"type": "label", "text": "Object Detected", "position": "top", "color": "#00ff00"}
                        ]
                    }
                ]
            }
    
    # Build response
    concepts = []
    overlays = []
    modules = []
    
    for concept in concepts_data["concepts"]:
        concepts.append({
            "id": concept["name"].lower().replace(" ", "_"),
            "name": concept["name"],
            "category": concept["category"],
            "formulas": concept["formulas"]
        })
        
        overlays.extend([{
            "concept_id": concept["name"].lower().replace(" ", "_"),
            **overlay
        } for overlay in concept.get("overlays", [])])
        
        # attempt to enrich module with notes and external links from TOPICS_DATABASE
        module_entry = {
            "id": concept["name"].lower().replace(" ", "_"),
            "title": concept["name"],
            "category": concept["category"],
            "formulas": concept["formulas"],
            "difficulty": "intermediate",
            "notes": None,
            "byjus_link": None
        }

        # find matching topic in TOPICS_DATABASE (simple substring/name match)
        for subj, topics in TOPICS_DATABASE.items():
            for t in topics:
                if t["name"].lower() == concept["name"].lower() or concept["name"].lower() in t["name"].lower():
                    module_entry["notes"] = t.get("notes")
                    module_entry["byjus_link"] = t.get("byjus_link")
                    # prefer explicit difficulty if present
                    module_entry["difficulty"] = t.get("difficulty", module_entry["difficulty"])
                    break
            if module_entry["notes"]:
                break

        modules.append(module_entry)
    
    # Add real-time web search description using Gemini
    web_search_info = await get_object_web_info(object_class)
    
    return ConceptResponse(
        concepts=concepts,
        overlays=overlays,
        modules=modules,
        web_info=web_search_info
    )


@app.post("/api/analyze-image")
async def analyze_image_with_gemini(file: UploadFile = File(...)):
    """
    Analyze uploaded image using Gemini Vision API
    Returns precise component positions and educational AR overlay data
    """
    try:
        # Read and process the uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary (in case of PNG with alpha channel)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize if too large (max 512px for FASTER processing)
        max_size = 512  # Reduced from 1024 for speed
        if image.width > max_size or image.height > max_size:
            ratio = min(max_size / image.width, max_size / image.height)
            new_size = (int(image.width * ratio), int(image.height * ratio))
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Encode image to base64 for Gemini Vision API with lower quality for speed
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG", quality=70)  # Reduced from 85 for speed
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Prepare OPTIMIZED prompt for Gemini Vision (shorter = faster)
        prompt = """Analyze this image quickly. Return ONLY JSON:
{
  "object_detected": "object name",
  "confidence": 0.95,
  "components": [
    {"name": "Part1", "position": {"x": 0.5, "y": 0.3}, "description": "Brief desc"},
    {"name": "Part2", "position": {"x": 0.3, "y": 0.7}, "description": "Brief desc"}
  ],
  "concepts": [
    {"name": "Main Concept", "category": "physics", "formulas": ["F=ma"]}
  ],
  "educational_info": {
    "description": "Brief 2 sentence description",
    "key_facts": ["fact1", "fact2", "fact3"],
    "scientific_principles": ["principle1"],
    "fun_fact": "One interesting fact"
  },
  "processes": [
    {"name": "Process", "type": "arrow", "from": {"x": 0.3, "y": 0.4}, "to": {"x": 0.7, "y": 0.4}, "label": "Label", "color": "#00ff00"}
  ]
}

Rules:
- x,y positions: 0-1 (0=left/top, 1=right/bottom)
- Provide 5-8 component labels
- Include 1-2 processes if relevant
- Be concise and fast
"""
        
        # Call Gemini Vision API
        model_vision = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model_vision.generate_content([
            prompt,
            {
                "mime_type": "image/jpeg",
                "data": img_base64
            }
        ])
        
        # Parse the response
        response_text = response.text.strip()
        
        # Clean up response (remove markdown code blocks if present)
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse JSON
        analysis_result = json.loads(response_text)
        
        # Add metadata
        analysis_result["image_width"] = image.width
        analysis_result["image_height"] = image.height
        analysis_result["processing_time"] = "1-2 seconds"
        
        return analysis_result
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Response text: {response_text[:500]}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse Gemini Vision response: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Gemini Vision analysis failed: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Image analysis failed: {str(e)}"
        )


@app.post("/api/solve-equation")
async def solve_equation(equation: str, variable: str = "x"):
    """
    Solve mathematical equations using SymPy
    """
    try:
        expr = parse_expr(equation)
        var = sp.Symbol(variable)
        solution = sp.solve(expr, var)
        
        return {
            "equation": equation,
            "variable": variable,
            "solutions": [str(sol) for sol in solution],
            "latex": sp.latex(expr)
        }
    except Exception as e:
        return {
            "error": str(e),
            "equation": equation
        }


@app.get("/api/topics")
async def list_topics(subject: str = None):
    """
    Return the catalog of topics. If subject is provided (math|physics|chemistry), return only that subject.
    """
    if subject:
        subject_key = subject.lower()
        return {subject_key: TOPICS_DATABASE.get(subject_key, [])}
    return TOPICS_DATABASE


@app.post("/api/concept-relationships")
async def get_concept_relationships(concepts: List[str]):
    """
    Build a knowledge graph of concept relationships
    """
    G = nx.Graph()
    
    # Add concepts as nodes
    for concept in concepts:
        G.add_node(concept)
    
    # Define relationships (this is a simplified example)
    relationships = {
        ("photosynthesis", "diffusion"): "requires",
        ("torque", "angular_momentum"): "related_to",
        ("pressure", "volume"): "inverse_relationship",
        ("force", "acceleration"): "proportional_to"
    }
    
    # Add edges
    for (concept1, concept2), relationship in relationships.items():
        if concept1 in concepts and concept2 in concepts:
            G.add_edge(concept1, concept2, relationship=relationship)
    
    # Convert to JSON-serializable format
    graph_data = {
        "nodes": [{"id": node, "label": node.replace("_", " ").title()} for node in G.nodes()],
        "edges": [
            {
                "source": edge[0],
                "target": edge[1],
                "relationship": G.edges[edge].get("relationship", "related")
            }
            for edge in G.edges()
        ]
    }
    
    return graph_data


@app.get("/api/topics/generate")
async def generate_topics_dynamically(subject: Optional[str] = None, count: int = 20):
    """
    Generate educational topics dynamically using Gemini AI
    """
    try:
        if not subject:
            # Generate comprehensive catalog
            subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Geometry", "Engineering"]
            all_topics = []
            
            for subj in subjects:
                topics = await generate_gemini_topics(subj, count // len(subjects))
                all_topics.extend(topics)
            
            return {"topics": all_topics, "total": len(all_topics)}
        else:
            # Generate for specific subject
            topics = await generate_gemini_topics(subject, count)
            return {"subject": subject, "topics": topics, "total": len(topics)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate topics: {str(e)}")


async def generate_gemini_topics(subject: str, count: int) -> List[Dict[str, Any]]:
    """Generate topics using Gemini AI"""
    prompt = f"""Generate exactly {count} educational topics for {subject} suitable for high school and college students.

For each topic provide these exact fields:
- name: Topic name (2-4 words)
- category: must be one of: math, physics, chemistry, biology, geometry, engineering
- notes: Detailed 200-300 word explanation
- formulas: Array of 2-5 formulas as plain text strings
- difficulty: must be one of: beginner, intermediate, advanced
- key_points: Array of 3-5 key concept bullet points
- applications: Array of 2-3 real-world uses

Return ONLY a valid JSON array with NO markdown, NO code blocks, NO extra text:
[{{"name":"Newton's Laws","category":"physics","notes":"...","formulas":["F=ma","..."],"difficulty":"intermediate","key_points":["..."],"applications":["..."]}}]"""

    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        
        print(f"🤖 Gemini raw response for {subject}:")
        print(text[:500])  # Debug first 500 chars
        
        # Aggressive cleaning of markdown
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Find JSON array in response
        start_idx = text.find('[')
        end_idx = text.rfind(']')
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx+1]
        
        topics = json.loads(text)
        
        # Validate and add Byju's links
        validated_topics = []
        for topic in topics:
            if isinstance(topic, dict) and 'name' in topic:
                topic_name = topic.get("name", "")
                topic["byjus_link"] = f"https://byjus.com/search/?q={topic_name.replace(' ', '+')}"
                validated_topics.append(topic)
        
        print(f"✅ Generated {len(validated_topics)} topics for {subject}")
        return validated_topics
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error for {subject}: {e}")
        print(f"Response text: {text[:1000]}")
        return []
    except Exception as e:
        print(f"❌ Error generating topics for {subject}: {e}")
        import traceback
        traceback.print_exc()
        return []


async def generate_ar_overlays_gemini(object_name: str) -> Dict[str, Any]:
    """Generate AR overlay configurations dynamically using Gemini AI"""
    prompt = f"""Generate AR overlay configuration for educational visualization of: {object_name}

Provide 8-12 detailed anatomical/component labels and educational visualizations.

Return ONLY valid JSON:
{{
  "concepts": [
    {{
      "name": "Primary Concept Name",
      "category": "physics/chemistry/biology/geometry",
      "formulas": ["formula1", "formula2"],
      "overlays": [
        {{"type": "label", "text": "Component Name", "position": "top", "color": "#hexcolor"}},
        {{"type": "label", "text": "Part Name", "position": "bottom", "color": "#hexcolor"}},
        {{"type": "arrow", "label": "Process", "direction": "up", "color": "#hexcolor"}},
        {{"type": "particles", "label": "Particle", "movement": "random", "color": "rgba(...)"}}
      ]
    }}
  ]
}}

For {object_name}, include:
- 6-8 anatomical/component labels with positions: top, bottom, left, right, center, top-left, bottom-right, front
- 2-3 process arrows with directions: up, down, left, right
- 1-2 particle effects with movement: random, flow
- Use color coding: green (#00ff00 - #88ff00) for biological, red (#ff0000 - #ff8800) for mechanical, blue (#0088ff) for fluids

Make labels specific to {object_name} anatomy and function."""

    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        
        print(f"🤖 Gemini AR overlay response for '{object_name}':")
        print(text[:300])
        
        # Clean markdown
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Find JSON object
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx+1]
        
        config = json.loads(text)
        return config
        
    except Exception as e:
        print(f"❌ Error generating AR overlays for {object_name}: {e}")
        return {"concepts": []}


@app.get("/api/ar-overlays/generate/{object_name}")
async def generate_ar_overlays(object_name: str):
    """
    Generate AR overlay configurations dynamically using Gemini AI
    """
    try:
        prompt = f"""Generate AR overlay configuration for educational visualization of: {object_name}

Provide detailed anatomical/component labels and visualizations.

Return ONLY valid JSON:
{{
  "concepts": [
    {{
      "name": "Primary Concept",
      "category": "physics/chemistry/biology/geometry",
      "formulas": ["..."],
      "overlays": [
        {{"type": "label", "text": "Component Name", "position": "top/bottom/left/right/center", "color": "#hexcolor"}},
        {{"type": "arrow", "label": "Process", "direction": "up/down", "color": "#hexcolor"}},
        {{"type": "particles", "label": "Particle", "movement": "random", "color": "rgba(...)"}}
      ]
    }}
  ]
}}

Include 8-12 overlays total with anatomical labels, process arrows, and particle effects."""

        response = gemini_model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean markdown
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        config = json.loads(text)
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate AR overlays: {str(e)}")


@app.post("/api/chat-query")
async def handle_chat_query(request: dict):
    """
    Handle chatbot queries - both object-specific and general educational questions using Gemini
    """
    try:
        query = request.get("query", "")
        context = request.get("context", "")  # Object name if available
        conversation_history = request.get("conversation_history", [])
        
        # Build conversation context
        history_text = ""
        for msg in conversation_history[-3:]:  # Last 3 messages
            role = msg.get("role", "user")
            content = msg.get("content", "")
            # Skip long messages in history
            if len(content) < 200:
                history_text += f"{role.capitalize()}: {content}\n"
        
        # Create intelligent prompt based on whether we have object context
        if context:
            # Object-specific mode
            prompt = f"""You are KAIROS AI - an expert educational assistant helping students learn about objects and scientific concepts.

Context: The user is looking at a **{context}** and has a question.

Previous conversation:
{history_text}

Student's question: {query}

Provide a helpful, educational response that:
1. Answers their question clearly and accurately
2. Relates to the detected object ({context}) when relevant
3. Includes scientific concepts, formulas, or principles when appropriate
4. Is engaging and encouraging for learning
5. Uses examples and analogies when helpful
6. Keep responses under 250 words for clarity

If the question is about {context}, provide detailed information. If it's about something else, answer it while maintaining educational value.

Response:"""
        else:
            # General educational mode
            prompt = f"""You are KAIROS AI - an expert educational assistant specializing in science, mathematics, physics, chemistry, and biology.

Previous conversation:
{history_text}

Student's question: {query}

Provide a comprehensive educational response that:
1. Answers their question clearly and accurately
2. Includes relevant formulas, equations, or scientific principles
3. Uses real-world examples and applications
4. Breaks down complex concepts into understandable parts
5. Encourages further learning and curiosity
6. Keep responses under 250 words for clarity

Topics you excel at:
- Mathematics (algebra, calculus, geometry, trigonometry)
- Physics (mechanics, thermodynamics, electromagnetism, quantum)
- Chemistry (organic, inorganic, physical chemistry, reactions)
- Biology (cell biology, genetics, ecology, physiology)
- General science concepts and principles

Response:"""

        response = gemini_model.generate_content(prompt)
        ai_response = response.text.strip()
        
        return {
            "response": ai_response,
            "context": context if context else "general",
            "query": query
        }
        
    except Exception as e:
        print(f"❌ Chat query error: {e}")
        return {
            "response": "I apologize, but I'm having trouble processing your question right now. Please try rephrasing or ask something else! I'm here to help with any educational topic.",
            "error": str(e)
        }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "KAIROS 2.0 Backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
