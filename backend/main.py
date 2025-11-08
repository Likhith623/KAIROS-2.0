from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import sympy as sp
import networkx as nx
from sympy.parsing.sympy_parser import parse_expr
import json

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
                    {"type": "label", "text": "Chlorophyll", "position": "leaf"},
                    {"type": "arrow", "direction": "up", "label": "Transpiration"}
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
                    {"type": "vector", "components": ["vx", "vy"], "decompose": True}
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
                    {"type": "acceleration_arrow", "color": "green"}
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
    }
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
    Extract scientific concepts from detected objects
    """
    object_class = request.object_class.lower()
    
    # Find matching concepts in database
    concepts_data = CONCEPT_DATABASE.get(object_class, None)
    
    if not concepts_data:
        # Default fallback for unknown objects
        concepts_data = {
            "concepts": [
                {
                    "name": "Structure & Form",
                    "category": "general",
                    "formulas": [],
                    "overlays": [
                        {"type": "outline", "color": "white"},
                        {"type": "label", "text": "Object Detected"}
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
        
        modules.append({
            "id": concept["name"].lower().replace(" ", "_"),
            "title": concept["name"],
            "category": concept["category"],
            "formulas": concept["formulas"],
            "difficulty": "intermediate"
        })
    
    return ConceptResponse(
        concepts=concepts,
        overlays=overlays,
        modules=modules
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


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "KAIROS 2.0 Backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
