// Static Educational Modules - NO API CALLS
// 20 Topics Total: Math (5), Physics (5), Chemistry (5), Biology (5)
// First 3 per subject: Full content with diagrams, formulas, theory
// Last 2 per subject: Theory and names only

export interface ModuleTopic {
  id: string;
  title: string;
  category: 'math' | 'physics' | 'chemistry' | 'biology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  
  // Core content
  description: string;
  theory: string;
  
  // Rich content (first 3 topics only)
  formulas?: string[];
  diagrams?: DiagramData[];
  examples?: Example[];
  keyPoints?: string[];
  applications?: string[];
  
  // Editable by user (stored in localStorage)
  userNotes?: string;
}

export interface DiagramData {
  type: 'svg' | 'equation' | 'graph' | 'flowchart';
  title: string;
  content: string; // SVG markup or equation LaTeX
  description: string;
}

export interface Example {
  question: string;
  solution: string;
  steps?: string[];
}

// ==================== MATHEMATICS (5 Topics) ====================

export const mathTopics: ModuleTopic[] = [
  // ===== MATH TOPIC 1: Calculus - Derivatives (FULL) =====
  {
    id: 'math-derivatives',
    title: 'Calculus - Derivatives',
    category: 'math',
    difficulty: 'intermediate',
    icon: '📈',
    description: 'Master the fundamental concept of derivatives - the rate of change and slopes of curves.',
    
    theory: `**Derivatives** represent the instantaneous rate of change of a function. They are fundamental to understanding motion, optimization, and change in mathematics and science.

**Core Concept:**
The derivative of a function f(x) at point x measures how fast f(x) is changing at that exact point. Geometrically, it represents the slope of the tangent line to the curve at that point.

**Formal Definition:**
The derivative f'(x) is defined as:
f'(x) = lim(h→0) [f(x+h) - f(x)] / h

This limit gives us the instantaneous rate of change, as opposed to average rate of change over an interval.

**Physical Interpretation:**
- **Position → Velocity:** If s(t) represents position, then s'(t) is velocity
- **Velocity → Acceleration:** If v(t) represents velocity, then v'(t) is acceleration
- **Economics:** Marginal cost is the derivative of total cost function

**Why Derivatives Matter:**
1. **Optimization:** Find maximum and minimum values (critical points)
2. **Motion Analysis:** Describe velocity and acceleration
3. **Curve Sketching:** Understand function behavior
4. **Related Rates:** Solve problems involving multiple changing quantities
5. **Approximation:** Use tangent lines to approximate function values`,

    formulas: [
      'd/dx (x^n) = n·x^(n-1) --- Power Rule',
      'd/dx (e^x) = e^x --- Exponential Function',
      'd/dx (ln x) = 1/x --- Natural Logarithm',
      'd/dx (sin x) = cos x --- Sine Function',
      'd/dx (cos x) = -sin x --- Cosine Function',
      'd/dx [f(x)·g(x)] = f\'(x)·g(x) + f(x)·g\'(x) --- Product Rule',
      'd/dx [f(x)/g(x)] = [f\'(x)·g(x) - f(x)·g\'(x)] / [g(x)]² --- Quotient Rule',
      'd/dx [f(g(x))] = f\'(g(x))·g\'(x) --- Chain Rule',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Derivative as Slope of Tangent Line',
        content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Axes -->
  <line x1="40" y1="260" x2="360" y2="260" stroke="#666" stroke-width="2"/>
  <line x1="40" y1="260" x2="40" y2="20" stroke="#666" stroke-width="2"/>
  
  <!-- Function curve (parabola) -->
  <path d="M 60 240 Q 200 60 340 180" stroke="#3b82f6" stroke-width="3" fill="none"/>
  
  <!-- Tangent line at point -->
  <line x1="100" y1="200" x2="300" y2="100" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>
  
  <!-- Point of tangency -->
  <circle cx="200" cy="150" r="5" fill="#10b981"/>
  
  <!-- Labels -->
  <text x="200" y="130" fill="#10b981" font-size="14" font-weight="bold">Point (x, f(x))</text>
  <text x="250" y="90" fill="#ef4444" font-size="14">Tangent Line (slope = f'(x))</text>
  <text x="180" y="250" fill="#3b82f6" font-size="14" font-weight="bold">y = f(x)</text>
  
  <!-- Axis labels -->
  <text x="365" y="265" fill="#666" font-size="12">x</text>
  <text x="25" y="20" fill="#666" font-size="12">y</text>
  
  <!-- Slope annotation -->
  <path d="M 200 150 L 240 150 L 240 130" stroke="#f59e0b" stroke-width="2" fill="none"/>
  <text x="245" y="145" fill="#f59e0b" font-size="12">Δy</text>
  <text x="215" y="165" fill="#f59e0b" font-size="12">Δx</text>
</svg>`,
        description: 'The derivative f\'(x) represents the slope of the tangent line at any point on the curve.'
      },
      {
        type: 'equation',
        title: 'Power Rule Visualization',
        content: 'f(x) = x³ → f\'(x) = 3x²',
        description: 'Example: The derivative of x³ is 3x². The power decreases by 1, and the original power becomes the coefficient.'
      },
      {
        type: 'flowchart',
        title: 'Derivative Decision Tree',
        content: `<svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Start -->
  <rect x="180" y="10" width="140" height="40" rx="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
  <text x="250" y="35" fill="white" font-size="14" text-anchor="middle" font-weight="bold">Find f'(x)</text>
  
  <!-- Is it x^n? -->
  <rect x="180" y="80" width="140" height="50" rx="10" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
  <text x="250" y="100" fill="white" font-size="12" text-anchor="middle">Is it</text>
  <text x="250" y="118" fill="white" font-size="12" text-anchor="middle" font-weight="bold">x^n?</text>
  
  <line x1="250" y1="50" x2="250" y2="80" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Yes branch - Power Rule -->
  <rect x="50" y="170" width="120" height="50" rx="10" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="110" y="190" fill="white" font-size="11" text-anchor="middle" font-weight="bold">Power Rule</text>
  <text x="110" y="208" fill="white" font-size="11" text-anchor="middle">n·x^(n-1)</text>
  
  <line x1="220" y1="105" x2="170" y2="170" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="185" y="140" fill="#10b981" font-size="12" font-weight="bold">YES</text>
  
  <!-- No branch - Product? -->
  <rect x="230" y="170" width="120" height="50" rx="10" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
  <text x="290" y="190" fill="white" font-size="11" text-anchor="middle">Product</text>
  <text x="290" y="208" fill="white" font-size="11" text-anchor="middle" font-weight="bold">f·g?</text>
  
  <line x1="280" y1="105" x2="290" y2="170" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="295" y="140" fill="#666" font-size="12" font-weight="bold">NO</text>
  
  <!-- Product Rule -->
  <rect x="200" y="260" width="180" height="50" rx="10" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="290" y="278" fill="white" font-size="11" text-anchor="middle" font-weight="bold">Product Rule</text>
  <text x="290" y="296" fill="white" font-size="10" text-anchor="middle">f'·g + f·g'</text>
  
  <line x1="290" y1="220" x2="290" y2="260" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="300" y="245" fill="#10b981" font-size="12" font-weight="bold">YES</text>
  
  <!-- Chain Rule -->
  <rect x="380" y="170" width="110" height="50" rx="10" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
  <text x="435" y="190" fill="white" font-size="11" text-anchor="middle" font-weight="bold">Composite?</text>
  <text x="435" y="208" fill="white" font-size="10" text-anchor="middle">Use Chain Rule</text>
  
  <line x1="330" y1="195" x2="380" y2="195" stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="355" y="190" fill="#666" font-size="12" font-weight="bold">NO</text>
  
  <!-- Arrow marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#666" />
    </marker>
  </defs>
</svg>`,
        description: 'Decision tree for choosing the correct differentiation rule based on function type.'
      }
    ],

    examples: [
      {
        question: 'Find the derivative of f(x) = 3x⁴ - 2x² + 5x - 7',
        solution: 'f\'(x) = 12x³ - 4x + 5',
        steps: [
          'Apply power rule to each term separately',
          'd/dx(3x⁴) = 3·4x³ = 12x³',
          'd/dx(-2x²) = -2·2x = -4x',
          'd/dx(5x) = 5',
          'd/dx(-7) = 0 (constant)',
          'Combine: f\'(x) = 12x³ - 4x + 5'
        ]
      },
      {
        question: 'Find dy/dx if y = (2x + 1)(x² - 3)',
        solution: 'dy/dx = 6x² + 2x - 6',
        steps: [
          'Use Product Rule: d/dx[f·g] = f\'·g + f·g\'',
          'Let f = 2x + 1, then f\' = 2',
          'Let g = x² - 3, then g\' = 2x',
          'Apply: dy/dx = (2)(x² - 3) + (2x + 1)(2x)',
          'Expand: dy/dx = 2x² - 6 + 4x² + 2x',
          'Simplify: dy/dx = 6x² + 2x - 6'
        ]
      },
      {
        question: 'Find f\'(x) if f(x) = (3x² + 1)⁵',
        solution: 'f\'(x) = 30x(3x² + 1)⁴',
        steps: [
          'Use Chain Rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x)',
          'Outer function: u⁵, inner function: u = 3x² + 1',
          'd/dx(u⁵) = 5u⁴',
          'd/dx(3x² + 1) = 6x',
          'Multiply: f\'(x) = 5(3x² + 1)⁴ · 6x',
          'Simplify: f\'(x) = 30x(3x² + 1)⁴'
        ]
      }
    ],

    keyPoints: [
      'The derivative measures instantaneous rate of change',
      'Power Rule is the most fundamental: d/dx(xⁿ) = n·xⁿ⁻¹',
      'Product Rule for multiplying functions: (fg)\' = f\'g + fg\'',
      'Quotient Rule for dividing functions: (f/g)\' = (f\'g - fg\') / g²',
      'Chain Rule for composite functions: d/dx[f(g(x))] = f\'(g(x))·g\'(x)',
      'Derivative of constant is always zero',
      'Critical points occur where f\'(x) = 0 or undefined'
    ],

    applications: [
      'Physics: Finding velocity from position, acceleration from velocity',
      'Economics: Marginal cost, marginal revenue, elasticity of demand',
      'Optimization: Maximize profit, minimize cost, find best dimensions',
      'Engineering: Design optimization, control systems, signal processing',
      'Biology: Population growth rates, reaction rates in chemistry',
      'Computer Graphics: Smooth curves, animation interpolation'
    ]
  },

  // ===== MATH TOPIC 2: Linear Algebra - Matrices (FULL) =====
  {
    id: 'math-matrices',
    title: 'Linear Algebra - Matrices',
    category: 'math',
    difficulty: 'intermediate',
    icon: '🔢',
    description: 'Explore matrices - powerful mathematical tools for solving systems of equations and transformations.',
    
    theory: `**Matrices** are rectangular arrays of numbers arranged in rows and columns. They are fundamental to modern mathematics, computer science, physics, and engineering.

**What is a Matrix?**
A matrix is denoted by capital letters and consists of elements arranged in m rows and n columns (m × n matrix):

A = [a₁₁  a₁₂  a₁₃]
    [a₂₁  a₂₂  a₂₃]

**Why Matrices Matter:**
1. **Systems of Linear Equations:** Solve multiple equations simultaneously
2. **Transformations:** Rotate, scale, shear, and reflect geometric objects
3. **Computer Graphics:** Render 3D graphics, game engines, animations
4. **Data Science:** Machine learning, neural networks, data analysis
5. **Physics:** Quantum mechanics, relativity, mechanics

**Matrix Operations:**

**Addition/Subtraction:** Add or subtract corresponding elements
- Only possible when matrices have same dimensions
- A + B is performed element-wise

**Scalar Multiplication:** Multiply every element by a constant
- c·A multiplies each element by scalar c

**Matrix Multiplication:** Complex but powerful operation
- Number of columns in first matrix must equal number of rows in second
- Result is a new matrix with combined transformations
- **NOT commutative:** A·B ≠ B·A in general

**Special Matrices:**
- **Identity Matrix (I):** Diagonal of 1s, rest 0s (like multiplying by 1)
- **Zero Matrix (O):** All elements are 0
- **Diagonal Matrix:** Only diagonal elements are non-zero
- **Symmetric Matrix:** A = Aᵀ (equals its transpose)
- **Inverse Matrix (A⁻¹):** A·A⁻¹ = I (like division)

**Determinant:**
A single number that provides important information about a matrix:
- If det(A) = 0, matrix is singular (non-invertible)
- If det(A) ≠ 0, matrix is invertible
- Used to solve systems of equations, find areas/volumes`,

    formulas: [
      'Matrix Addition: (A + B)ᵢⱼ = Aᵢⱼ + Bᵢⱼ',
      'Scalar Multiplication: (c·A)ᵢⱼ = c·Aᵢⱼ',
      'Matrix Multiplication: (A·B)ᵢⱼ = Σₖ Aᵢₖ·Bₖⱼ',
      'Transpose: (Aᵀ)ᵢⱼ = Aⱼᵢ',
      'Determinant (2×2): det([a b; c d]) = ad - bc',
      'Determinant (3×3): det(A) = a(ei-fh) - b(di-fg) + c(dh-eg)',
      'Inverse (2×2): A⁻¹ = (1/det(A))·[d -b; -c a]',
      'Identity: I·A = A·I = A'
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Matrix Structure',
        content: `<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Matrix brackets -->
  <path d="M 80 60 L 60 60 L 60 240 L 80 240" stroke="#3b82f6" stroke-width="3" fill="none"/>
  <path d="M 420 60 L 440 60 L 440 240 L 420 240" stroke="#3b82f6" stroke-width="3" fill="none"/>
  
  <!-- Matrix elements -->
  <text x="120" y="100" fill="#1f2937" font-size="24" font-family="monospace">a₁₁</text>
  <text x="220" y="100" fill="#1f2937" font-size="24" font-family="monospace">a₁₂</text>
  <text x="320" y="100" fill="#1f2937" font-size="24" font-family="monospace">a₁₃</text>
  
  <text x="120" y="160" fill="#1f2937" font-size="24" font-family="monospace">a₂₁</text>
  <text x="220" y="160" fill="#1f2937" font-size="24" font-family="monospace">a₂₂</text>
  <text x="320" y="160" fill="#1f2937" font-size="24" font-family="monospace">a₂₃</text>
  
  <text x="120" y="220" fill="#1f2937" font-size="24" font-family="monospace">a₃₁</text>
  <text x="220" y="220" fill="#1f2937" font-size="24" font-family="monospace">a₃₂</text>
  <text x="320" y="220" fill="#1f2937" font-size="24" font-family="monospace">a₃₃</text>
  
  <!-- Labels -->
  <text x="250" y="35" fill="#8b5cf6" font-size="18" text-anchor="middle" font-weight="bold">Matrix A (3×3)</text>
  <text x="250" y="270" fill="#6b7280" font-size="14" text-anchor="middle">3 rows × 3 columns</text>
  
  <!-- Row highlight -->
  <rect x="100" y="70" width="280" height="35" fill="#fef3c7" opacity="0.6" rx="5"/>
  <text x="30" y="95" fill="#f59e0b" font-size="16" font-weight="bold">Row 1</text>
  
  <!-- Column highlight -->
  <rect x="195" y="70" width="90" height="165" fill="#dbeafe" opacity="0.5" rx="5"/>
  <text x="240" y="260" fill="#3b82f6" font-size="16" font-weight="bold">Col 2</text>
</svg>`,
        description: 'A matrix is a rectangular array with elements organized in rows and columns. Each element is identified by its row and column position.'
      },
      {
        type: 'svg',
        title: 'Matrix Multiplication Process',
        content: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
  <!-- Matrix A -->
  <text x="50" y="100" fill="#1f2937" font-size="20" font-family="monospace">[2  3]</text>
  <text x="50" y="130" fill="#1f2937" font-size="20" font-family="monospace">[1  4]</text>
  <text x="80" y="80" fill="#3b82f6" font-size="16" font-weight="bold">A</text>
  
  <!-- Multiply sign -->
  <text x="160" y="115" fill="#6b7280" font-size="28" font-weight="bold">×</text>
  
  <!-- Matrix B -->
  <text x="210" y="100" fill="#1f2937" font-size="20" font-family="monospace">[5  6]</text>
  <text x="210" y="130" fill="#1f2937" font-size="20" font-family="monospace">[7  8]</text>
  <text x="240" y="80" fill="#10b981" font-size="16" font-weight="bold">B</text>
  
  <!-- Equals sign -->
  <text x="330" y="115" fill="#6b7280" font-size="28" font-weight="bold">=</text>
  
  <!-- Result Matrix C -->
  <text x="380" y="100" fill="#1f2937" font-size="20" font-family="monospace">[31  36]</text>
  <text x="380" y="130" fill="#1f2937" font-size="20" font-family="monospace">[33  38]</text>
  <text x="420" y="80" fill="#ef4444" font-size="16" font-weight="bold">C</text>
  
  <!-- Calculation example -->
  <rect x="30" y="170" width="540" height="90" fill="#f3f4f6" rx="10" stroke="#d1d5db" stroke-width="2"/>
  <text x="50" y="195" fill="#1f2937" font-size="14" font-weight="bold">Calculation for c₁₁:</text>
  <text x="50" y="215" fill="#6b7280" font-size="13">c₁₁ = (2×5) + (3×7) = 10 + 21 = 31</text>
  <text x="50" y="235" fill="#6b7280" font-size="13">Multiply row 1 of A by column 1 of B, then sum</text>
  <text x="50" y="255" fill="#8b5cf6" font-size="12" font-style="italic">Each element is the dot product of a row and column</text>
</svg>`,
        description: 'Matrix multiplication involves taking dot products of rows from the first matrix with columns from the second matrix.'
      },
      {
        type: 'svg',
        title: 'Identity Matrix',
        content: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Identity Matrix 3x3 -->
  <path d="M 80 60 L 60 60 L 60 240 L 80 240" stroke="#10b981" stroke-width="3" fill="none"/>
  <path d="M 320 60 L 340 60 L 340 240 L 320 240" stroke="#10b981" stroke-width="3" fill="none"/>
  
  <!-- Diagonal 1s (highlighted) -->
  <circle cx="120" cy="90" r="30" fill="#34d399" opacity="0.3"/>
  <text x="120" y="100" fill="#059669" font-size="32" font-family="monospace" text-anchor="middle" font-weight="bold">1</text>
  
  <circle cx="200" cy="150" r="30" fill="#34d399" opacity="0.3"/>
  <text x="200" y="160" fill="#059669" font-size="32" font-family="monospace" text-anchor="middle" font-weight="bold">1</text>
  
  <circle cx="280" cy="210" r="30" fill="#34d399" opacity="0.3"/>
  <text x="280" y="220" fill="#059669" font-size="32" font-family="monospace" text-anchor="middle" font-weight="bold">1</text>
  
  <!-- Zeros -->
  <text x="200" y="100" fill="#9ca3af" font-size="28" font-family="monospace" text-anchor="middle">0</text>
  <text x="280" y="100" fill="#9ca3af" font-size="28" font-family="monospace" text-anchor="middle">0</text>
  <text x="120" y="160" fill="#9ca3af" font-size="28" font-family="monospace" text-anchor="middle">0</text>
  <text x="280" y="160" fill="#9ca3af" font-size="28" font-family="monospace" text-anchor="middle">0</text>
  <text x="120" y="220" fill="#9ca3af" font-size="28" font-family="monospace" text-anchor="middle">0</text>
  <text x="200" y="220" fill="#9ca3af" font-size="28" font-family="monospace" text-anchor="middle">0</text>
  
  <!-- Labels -->
  <text x="200" y="35" fill="#10b981" font-size="20" text-anchor="middle" font-weight="bold">Identity Matrix I₃</text>
  <text x="200" y="275" fill="#6b7280" font-size="14" text-anchor="middle">A × I = I × A = A</text>
</svg>`,
        description: 'The identity matrix has 1s on the diagonal and 0s elsewhere. Multiplying any matrix by I returns the original matrix.'
      }
    ],

    examples: [
      {
        question: 'Add matrices A = [1 2; 3 4] and B = [5 6; 7 8]',
        solution: 'A + B = [6 8; 10 12]',
        steps: [
          'Add corresponding elements',
          'Element (1,1): 1 + 5 = 6',
          'Element (1,2): 2 + 6 = 8',
          'Element (2,1): 3 + 7 = 10',
          'Element (2,2): 4 + 8 = 12',
          'Result: [6 8; 10 12]'
        ]
      },
      {
        question: 'Multiply A = [2 3; 1 4] by B = [5 6; 7 8]',
        solution: 'A × B = [31 36; 33 38]',
        steps: [
          'Row 1 × Col 1: (2×5) + (3×7) = 10 + 21 = 31',
          'Row 1 × Col 2: (2×6) + (3×8) = 12 + 24 = 36',
          'Row 2 × Col 1: (1×5) + (4×7) = 5 + 28 = 33',
          'Row 2 × Col 2: (1×6) + (4×8) = 6 + 32 = 38',
          'Result: [31 36; 33 38]'
        ]
      },
      {
        question: 'Find the determinant of A = [3 5; 2 7]',
        solution: 'det(A) = 11',
        steps: [
          'For 2×2 matrix: det([a b; c d]) = ad - bc',
          'Identify: a=3, b=5, c=2, d=7',
          'Calculate: det(A) = (3×7) - (5×2)',
          'Compute: det(A) = 21 - 10',
          'Result: det(A) = 11'
        ]
      }
    ],

    keyPoints: [
      'Matrices organize data in rows and columns',
      'Matrix addition: add corresponding elements (same dimensions required)',
      'Matrix multiplication: NOT commutative (A×B ≠ B×A)',
      'Identity matrix I: multiplying by I returns original matrix',
      'Determinant = 0 means matrix is singular (non-invertible)',
      'Transpose: flip rows and columns (Aᵀ)',
      'Inverse matrix A⁻¹: A × A⁻¹ = I'
    ],

    applications: [
      '3D Graphics: Rotation, scaling, translation of objects',
      'Machine Learning: Neural networks, data transformations',
      'Economics: Input-output models, Leontief models',
      'Physics: Quantum mechanics, relativity, mechanics',
      'Computer Vision: Image processing, filters, transformations',
      'Engineering: Structural analysis, circuit analysis, control systems'
    ]
  },

  // ===== MATH TOPIC 3: Trigonometry (FULL) =====
  {
    id: 'math-trigonometry',
    title: 'Trigonometry - Sine, Cosine, Tangent',
    category: 'math',
    difficulty: 'beginner',
    icon: '△',
    description: 'Master the relationships between angles and sides in triangles - essential for waves, oscillations, and circles.',
    
    theory: `**Trigonometry** is the study of relationships between angles and sides of triangles. It's fundamental to understanding periodic phenomena like waves, oscillations, and circular motion.

**The Three Primary Ratios:**

For a right triangle with angle θ:
- **Sine (sin θ):** Opposite / Hypotenuse
- **Cosine (cos θ):** Adjacent / Hypotenuse  
- **Tangent (tan θ):** Opposite / Adjacent

**Mnemonic: SOH-CAH-TOA**
- **S**ine = **O**pposite / **H**ypotenuse
- **C**osine = **A**djacent / **H**ypotenuse
- **T**angent = **O**pposite / **A**djacent

**The Unit Circle:**
A circle with radius 1 centered at origin. Any point on the circle is (cos θ, sin θ) where θ is the angle from positive x-axis.

Key angles and their values:
- 0°: sin=0, cos=1
- 30°: sin=1/2, cos=√3/2
- 45°: sin=√2/2, cos=√2/2
- 60°: sin=√3/2, cos=1/2
- 90°: sin=1, cos=0

**Pythagorean Identity:**
sin²θ + cos²θ = 1
This is always true for any angle θ!

**Why Trigonometry Matters:**
1. **Wave Motion:** Sound, light, water waves
2. **Oscillations:** Pendulums, springs, AC current
3. **Navigation:** Finding distances, directions, GPS
4. **Engineering:** Structural forces, electrical circuits
5. **Computer Graphics:** Rotations, animations, games
6. **Astronomy:** Planetary motion, distances to stars

**Reciprocal Functions:**
- Cosecant: csc θ = 1/sin θ
- Secant: sec θ = 1/cos θ
- Cotangent: cot θ = 1/tan θ

**Angle Measurement:**
- Degrees: Full circle = 360°
- Radians: Full circle = 2π radians
- Conversion: 180° = π radians`,

    formulas: [
      'sin θ = Opposite / Hypotenuse',
      'cos θ = Adjacent / Hypotenuse',
      'tan θ = Opposite / Adjacent = sin θ / cos θ',
      'sin² θ + cos² θ = 1 --- Pythagorean Identity',
      '1 + tan² θ = sec² θ',
      '1 + cot² θ = csc² θ',
      'sin(A ± B) = sin A cos B ± cos A sin B --- Sum Formula',
      'cos(A ± B) = cos A cos B ∓ sin A sin B --- Sum Formula',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Right Triangle - SOH-CAH-TOA',
        content: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Right triangle -->
  <polygon points="100,300 400,300 400,100" fill="#dbeafe" stroke="#3b82f6" stroke-width="3"/>
  
  <!-- Right angle marker -->
  <rect x="380" y="280" width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="2"/>
  
  <!-- Angle θ -->
  <path d="M 150 300 A 50 50 0 0 1 130 270" stroke="#8b5cf6" stroke-width="3" fill="none"/>
  <text x="155" y="280" fill="#8b5cf6" font-size="24" font-weight="bold">θ</text>
  
  <!-- Side labels -->
  <text x="250" y="330" fill="#ef4444" font-size="20" font-weight="bold">Adjacent</text>
  <line x1="100" y1="315" x2="400" y2="315" stroke="#ef4444" stroke-width="2"/>
  
  <text x="420" y="210" fill="#10b981" font-size="20" font-weight="bold">Opposite</text>
  <line x1="415" y1="100" x2="415" y2="300" stroke="#10b981" stroke-width="2"/>
  
  <text x="220" y="190" fill="#f59e0b" font-size="20" font-weight="bold">Hypotenuse</text>
  <line x1="110" y1="295" x2="395" y2="105" stroke="#f59e0b" stroke-width="3"/>
  
  <!-- Formula box -->
  <rect x="50" y="20" width="400" height="60" fill="#f3f4f6" rx="10" stroke="#d1d5db" stroke-width="2"/>
  <text x="250" y="45" fill="#1f2937" font-size="16" text-anchor="middle" font-weight="bold">SOH-CAH-TOA</text>
  <text x="250" y="65" fill="#6b7280" font-size="13" text-anchor="middle">sin θ = Opp/Hyp  |  cos θ = Adj/Hyp  |  tan θ = Opp/Adj</text>
</svg>`,
        description: 'Right triangle showing the three sides relative to angle θ. Remember: SOH-CAH-TOA!'
      },
      {
        type: 'svg',
        title: 'Unit Circle with Key Angles',
        content: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Circle -->
  <circle cx="250" cy="250" r="150" fill="none" stroke="#3b82f6" stroke-width="3"/>
  
  <!-- Axes -->
  <line x1="50" y1="250" x2="450" y2="250" stroke="#6b7280" stroke-width="2"/>
  <line x1="250" y1="50" x2="250" y2="450" stroke="#6b7280" stroke-width="2"/>
  
  <!-- 0° / 360° -->
  <circle cx="400" cy="250" r="6" fill="#ef4444"/>
  <text x="415" y="255" fill="#ef4444" font-size="14" font-weight="bold">0°</text>
  
  <!-- 30° -->
  <circle cx="380" cy="175" r="6" fill="#f59e0b"/>
  <line x1="250" y1="250" x2="380" y2="175" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="385" y="165" fill="#f59e0b" font-size="14" font-weight="bold">30°</text>
  
  <!-- 45° -->
  <circle cx="356" cy="144" r="6" fill="#10b981"/>
  <line x1="250" y1="250" x2="356" y2="144" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="360" y="135" fill="#10b981" font-size="14" font-weight="bold">45°</text>
  
  <!-- 60° -->
  <circle cx="325" cy="120" r="6" fill="#3b82f6"/>
  <line x1="250" y1="250" x2="325" y2="120" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="330" y="110" fill="#3b82f6" font-size="14" font-weight="bold">60°</text>
  
  <!-- 90° -->
  <circle cx="250" cy="100" r="6" fill="#8b5cf6"/>
  <text x="255" y="95" fill="#8b5cf6" font-size="14" font-weight="bold">90°</text>
  
  <!-- 180° -->
  <circle cx="100" cy="250" r="6" fill="#ec4899"/>
  <text x="60" y="255" fill="#ec4899" font-size="14" font-weight="bold">180°</text>
  
  <!-- 270° -->
  <circle cx="250" cy="400" r="6" fill="#06b6d4"/>
  <text x="255" y="415" fill="#06b6d4" font-size="14" font-weight="bold">270°</text>
  
  <!-- Radius label -->
  <text x="320" y="185" fill="#1f2937" font-size="12">r = 1</text>
  
  <!-- Title -->
  <text x="250" y="30" fill="#1f2937" font-size="18" text-anchor="middle" font-weight="bold">Unit Circle</text>
  <text x="250" y="480" fill="#6b7280" font-size="13" text-anchor="middle">Point (x, y) = (cos θ, sin θ)</text>
</svg>`,
        description: 'The unit circle shows how sine and cosine relate to coordinates. Any point on the circle is (cos θ, sin θ).'
      },
      {
        type: 'svg',
        title: 'Sine and Cosine Waves',
        content: `<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid -->
  <line x1="50" y1="175" x2="550" y2="175" stroke="#d1d5db" stroke-width="1"/>
  
  <!-- Sine wave -->
  <path d="M 50 175 Q 100 75, 150 175 Q 200 275, 250 175 Q 300 75, 350 175 Q 400 275, 450 175 Q 500 75, 550 175" 
        stroke="#ef4444" stroke-width="3" fill="none"/>
  
  <!-- Cosine wave -->
  <path d="M 50 75 Q 100 175, 150 275 Q 200 175, 250 75 Q 300 175, 350 275 Q 400 175, 450 75 Q 500 175, 550 275" 
        stroke="#3b82f6" stroke-width="3" fill="none"/>
  
  <!-- Axis labels -->
  <text x="25" y="80" fill="#ef4444" font-size="16" font-weight="bold">+1</text>
  <text x="25" y="180" fill="#6b7280" font-size="16">0</text>
  <text x="25" y="280" fill="#ef4444" font-size="16" font-weight="bold">-1</text>
  
  <!-- X-axis markers -->
  <text x="150" y="195" fill="#6b7280" font-size="12">π/2</text>
  <text x="250" y="195" fill="#6b7280" font-size="12">π</text>
  <text x="350" y="195" fill="#6b7280" font-size="12">3π/2</text>
  <text x="450" y="195" fill="#6b7280" font-size="12">2π</text>
  
  <!-- Legend -->
  <line x1="200" y1="30" x2="240" y2="30" stroke="#ef4444" stroke-width="3"/>
  <text x="250" y="35" fill="#ef4444" font-size="16" font-weight="bold">sin θ</text>
  
  <line x1="340" y1="30" x2="380" y2="30" stroke="#3b82f6" stroke-width="3"/>
  <text x="390" y="35" fill="#3b82f6" font-size="16" font-weight="bold">cos θ</text>
  
  <!-- Title -->
  <text x="300" y="330" fill="#1f2937" font-size="14" text-anchor="middle">Angle θ (radians)</text>
</svg>`,
        description: 'Sine and cosine are periodic functions that oscillate between -1 and +1. Period = 2π radians (360°).'
      }
    ],

    examples: [
      {
        question: 'Find sin θ, cos θ, tan θ if opposite = 3, adjacent = 4',
        solution: 'sin θ = 3/5, cos θ = 4/5, tan θ = 3/4',
        steps: [
          'First find hypotenuse using Pythagorean theorem',
          'h² = 3² + 4² = 9 + 16 = 25',
          'h = √25 = 5',
          'sin θ = opposite/hypotenuse = 3/5',
          'cos θ = adjacent/hypotenuse = 4/5',
          'tan θ = opposite/adjacent = 3/4'
        ]
      },
      {
        question: 'If sin θ = 0.6, find cos θ (θ in first quadrant)',
        solution: 'cos θ = 0.8',
        steps: [
          'Use Pythagorean identity: sin² θ + cos² θ = 1',
          'Substitute: (0.6)² + cos² θ = 1',
          'Calculate: 0.36 + cos² θ = 1',
          'Solve: cos² θ = 1 - 0.36 = 0.64',
          'Take square root: cos θ = √0.64 = 0.8',
          '(Positive since θ is in first quadrant)'
        ]
      },
      {
        question: 'Find the height of a building if the angle of elevation is 30° from 50m away',
        solution: 'Height ≈ 28.87 meters',
        steps: [
          'Draw right triangle: height = opposite, distance = adjacent',
          'Use tan θ = opposite/adjacent',
          'tan 30° = height/50',
          'height = 50 × tan 30°',
          'height = 50 × (√3/3) ≈ 50 × 0.577',
          'height ≈ 28.87 meters'
        ]
      }
    ],

    keyPoints: [
      'SOH-CAH-TOA: Sine, Cosine, Tangent ratios for right triangles',
      'Pythagorean Identity: sin² θ + cos² θ = 1 (always true)',
      'Unit circle: Point (cos θ, sin θ) for angle θ',
      'Sine and cosine are periodic: repeat every 2π radians (360°)',
      'tan θ = sin θ / cos θ',
      '30-60-90 triangle: sides in ratio 1 : √3 : 2',
      '45-45-90 triangle: sides in ratio 1 : 1 : √2'
    ],

    applications: [
      'Navigation: GPS, surveying, finding distances',
      'Physics: Wave motion, oscillations, circular motion',
      'Engineering: Structural forces, electrical AC circuits',
      'Computer Graphics: Rotations, transformations, animations',
      'Astronomy: Planetary orbits, stellar distances',
      'Music: Sound waves, frequency analysis, harmonics'
    ]
  },

  // ===== MATH TOPIC 4: Probability & Statistics (THEORY ONLY) =====
  {
    id: 'math-probability',
    title: 'Probability & Statistics',
    category: 'math',
    difficulty: 'intermediate',
    icon: '⚄',
    description: 'Understanding randomness, chance, and data analysis through mathematical principles.',
    
    theory: `**Probability** is the mathematical study of random events and uncertainty. It quantifies how likely an event is to occur.

**Basic Probability:**
P(Event) = (Number of favorable outcomes) / (Total number of possible outcomes)

**Key Concepts:**
- **Sample Space:** All possible outcomes
- **Event:** A specific outcome or set of outcomes
- **Probability Range:** 0 ≤ P(E) ≤ 1 (0% to 100%)
- **Complementary Events:** P(E) + P(not E) = 1

**Types of Events:**
- **Independent Events:** One doesn't affect the other (coin flips)
- **Dependent Events:** One affects the other (drawing cards without replacement)
- **Mutually Exclusive:** Cannot happen simultaneously

**Statistics:**
Statistics is the science of collecting, analyzing, and interpreting data.

**Measures of Central Tendency:**
- **Mean:** Average of all values
- **Median:** Middle value when sorted
- **Mode:** Most frequent value

**Measures of Spread:**
- **Range:** Maximum - Minimum
- **Variance:** Average squared deviation from mean
- **Standard Deviation:** Square root of variance (σ)

**Applications:**
- Finance: Risk assessment, stock market analysis
- Healthcare: Clinical trials, disease spread
- Quality Control: Manufacturing defects
- Insurance: Premium calculations
- Sports: Player statistics, game predictions
- Machine Learning: Probabilistic models, AI`
  },

  // ===== MATH TOPIC 5: Number Theory (THEORY ONLY) =====
  {
    id: 'math-number-theory',
    title: 'Number Theory - Primes & Divisibility',
    category: 'math',
    difficulty: 'intermediate',
    icon: '∞',
    description: 'Study of integers, prime numbers, and their fascinating properties in cryptography and computing.',
    
    theory: `**Number Theory** is the study of integers and their properties. It's one of the oldest branches of mathematics with deep connections to cryptography and computer science.

**Prime Numbers:**
A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...

**Key Properties:**
- 2 is the only even prime number
- There are infinitely many primes (Euclid's theorem)
- Every integer > 1 is either prime or composite
- Fundamental Theorem of Arithmetic: Every integer has a unique prime factorization

**Divisibility:**
Integer a divides integer b (written a|b) if b = ka for some integer k.

**Greatest Common Divisor (GCD):**
The largest positive integer that divides both numbers.
- GCD(12, 18) = 6
- Found using Euclidean Algorithm

**Least Common Multiple (LCM):**
The smallest positive integer divisible by both numbers.
- LCM(12, 18) = 36

**Modular Arithmetic:**
"Clock arithmetic" - working with remainders
- 17 ≡ 2 (mod 5) means 17 and 2 have same remainder when divided by 5
- Used extensively in cryptography

**Applications:**
- **Cryptography:** RSA encryption, digital signatures
- **Computer Science:** Hash functions, random number generation
- **Coding Theory:** Error detection and correction
- **Blockchain:** Cryptocurrency mining, proof-of-work
- **Pure Mathematics:** Unsolved problems like Goldbach's Conjecture`
  },

  // ===== MATH TOPIC 6: Complex Numbers (THEORY ONLY) =====
  {
    id: 'math-complex-numbers',
    title: 'Complex Numbers & Imaginary Unit',
    category: 'math',
    difficulty: 'intermediate',
    icon: 'ℂ',
    description: 'Extend the real number system with imaginary numbers - essential for electrical engineering and quantum mechanics.',
    
    theory: `**Complex Numbers** extend the real number system by introducing the imaginary unit **i**, where i² = -1. They are essential in electrical engineering, quantum mechanics, and signal processing.

**Definition:**
A complex number z is written as: **z = a + bi**
- a is the **real part** (Re(z))
- b is the **imaginary part** (Im(z))
- i is the **imaginary unit** where i² = -1

**The Imaginary Unit:**
- i¹ = i
- i² = -1
- i³ = -i
- i⁴ = 1 (pattern repeats)

**Complex Plane:**
Complex numbers can be plotted on a 2D plane:
- Horizontal axis: Real part
- Vertical axis: Imaginary part
- Example: 3 + 4i is point (3, 4)

**Basic Operations:**
1. **Addition:** (a + bi) + (c + di) = (a + c) + (b + d)i
2. **Subtraction:** (a + bi) - (c + di) = (a - c) + (b - d)i
3. **Multiplication:** (a + bi)(c + di) = (ac - bd) + (ad + bc)i
4. **Division:** Multiply numerator and denominator by complex conjugate

**Complex Conjugate:**
The conjugate of z = a + bi is z̄ = a - bi
- Used to divide complex numbers
- |z|² = z · z̄ = a² + b²

**Modulus (Magnitude):**
|z| = √(a² + b²)
Represents the distance from origin in complex plane

**Polar Form:**
z = r(cos θ + i sin θ) = r·e^(iθ)
- r = |z| (modulus)
- θ = arg(z) (argument/angle)
- Euler's Formula: e^(iθ) = cos θ + i sin θ

**Powers and Roots:**
De Moivre's Theorem: (cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)
Used to find powers and nth roots of complex numbers

**Applications:**
- **Electrical Engineering:** AC circuit analysis (impedance)
- **Signal Processing:** Fourier transforms, frequency analysis
- **Quantum Mechanics:** Wave functions, probability amplitudes
- **Control Theory:** Transfer functions, stability analysis
- **Fractals:** Mandelbrot set, Julia sets
- **Fluid Dynamics:** Complex potential flow
- **Solving Equations:** Every polynomial has complex roots (Fundamental Theorem of Algebra)

**Why Complex Numbers Matter:**
Complex numbers aren't just abstract - they solve real problems! For example, the equation x² + 1 = 0 has no real solutions, but has two complex solutions: x = i and x = -i. Many physical phenomena (like alternating current) are most naturally described using complex numbers.`
  }
];

// ==================== PHYSICS (5 Topics) ====================

export const physicsTopics: ModuleTopic[] = [
  // ===== PHYSICS TOPIC 1: Newton's Laws of Motion (FULL) =====
  {
    id: 'physics-newtons-laws',
    title: 'Newton\'s Laws of Motion',
    category: 'physics',
    difficulty: 'beginner',
    icon: '🚀',
    description: 'Master the three fundamental laws that govern all motion in classical mechanics.',
    
    theory: `**Newton's Laws of Motion** are three physical laws that form the foundation of classical mechanics. They describe the relationship between forces acting on an object and its motion.

**First Law - Law of Inertia:**
An object at rest stays at rest, and an object in motion stays in motion with constant velocity, unless acted upon by an external force.

**Key Concept:** Inertia is the resistance of an object to change its state of motion. Mass is a measure of inertia - more massive objects have greater inertia.

**Examples:**
- A book on a table remains stationary until you push it
- A hockey puck slides on ice with nearly constant velocity (minimal friction)
- Passengers lurch forward when a car suddenly brakes

**Second Law - F = ma:**
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

**Mathematical Form:** F⃗ = m·a⃗

This is the most important equation in classical mechanics! It tells us:
- Greater force → Greater acceleration
- Greater mass → Smaller acceleration (for same force)
- Force and acceleration are in the same direction

**Third Law - Action-Reaction:**
For every action, there is an equal and opposite reaction. Forces always come in pairs.

**Key Understanding:**
- Forces act on DIFFERENT objects
- Equal magnitude, opposite direction
- Occur simultaneously

**Examples:**
- Walking: You push backward on ground → Ground pushes you forward
- Rocket propulsion: Rocket expels gas downward → Gas pushes rocket upward
- Swimming: You push water backward → Water pushes you forward

**Why These Laws Matter:**
1. **Engineering:** Design of vehicles, structures, machines
2. **Space Exploration:** Rocket trajectories, satellite orbits
3. **Sports:** Optimizing performance in running, throwing, jumping
4. **Safety:** Seatbelts, airbags, crumple zones in cars
5. **Everyday Life:** Understanding why objects move the way they do`,

    formulas: [
      'F⃗ = m·a⃗ --- Newton\'s Second Law (Net Force = Mass × Acceleration)',
      'F = ma --- Scalar form when motion is one-dimensional',
      'ΣF⃗ = 0 → a⃗ = 0 --- First Law (equilibrium condition)',
      'F⃗₁₂ = -F⃗₂₁ --- Third Law (action-reaction pairs)',
      'W = m·g --- Weight (special force due to gravity)',
      'f = μ·N --- Friction force (μ = coefficient, N = normal force)',
      'v = v₀ + at --- Velocity with constant acceleration',
      's = v₀t + ½at² --- Displacement with constant acceleration',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Newton\'s Second Law - F = ma',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Ground line -->
  <line x1="50" y1="300" x2="550" y2="300" stroke="#6b7280" stroke-width="3"/>
  <pattern id="groundPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <line x1="0" y1="20" x2="20" y2="0" stroke="#9ca3af" stroke-width="1"/>
  </pattern>
  <rect x="50" y="300" width="500" height="30" fill="url(#groundPattern)"/>
  
  <!-- Box (object) -->
  <rect x="200" y="220" width="100" height="80" fill="#3b82f6" stroke="#1e40af" stroke-width="3" rx="5"/>
  <text x="250" y="265" fill="white" font-size="20" text-anchor="middle" font-weight="bold">m</text>
  
  <!-- Applied Force Arrow -->
  <defs>
    <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0, 10 3, 0 6" fill="#ef4444"/>
    </marker>
    <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
    </marker>
  </defs>
  
  <line x1="90" y1="260" x2="190" y2="260" stroke="#ef4444" stroke-width="4" marker-end="url(#arrowRed)"/>
  <text x="100" y="245" fill="#ef4444" font-size="18" font-weight="bold">F (Force)</text>
  
  <!-- Acceleration Arrow -->
  <line x1="310" y1="260" x2="460" y2="260" stroke="#10b981" stroke-width="4" marker-end="url(#arrowGreen)"/>
  <text x="350" y="245" fill="#10b981" font-size="18" font-weight="bold">a (Acceleration)</text>
  
  <!-- Equation Display -->
  <rect x="150" y="50" width="300" height="100" fill="#1f2937" stroke="#3b82f6" stroke-width="3" rx="10"/>
  <text x="300" y="90" fill="#3b82f6" font-size="32" text-anchor="middle" font-weight="bold">F = m · a</text>
  <text x="300" y="125" fill="#9ca3af" font-size="14" text-anchor="middle">Force = Mass × Acceleration</text>
  
  <!-- Labels -->
  <text x="300" y="370" fill="#6b7280" font-size="14" text-anchor="middle">Greater force → Greater acceleration</text>
  <text x="300" y="390" fill="#6b7280" font-size="14" text-anchor="middle">Greater mass → Smaller acceleration</text>
</svg>`,
        description: 'Newton\'s Second Law: The net force on an object equals its mass times acceleration. Force and acceleration are in the same direction.'
      },
      {
        type: 'svg',
        title: 'Newton\'s Third Law - Action-Reaction',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Ground -->
  <rect x="0" y="300" width="600" height="100" fill="#8b7355"/>
  <line x1="0" y1="300" x2="600" y2="300" stroke="#6b5744" stroke-width="3"/>
  
  <!-- Person -->
  <circle cx="300" cy="240" r="25" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <line x1="300" y1="265" x2="300" y2="300" stroke="#f59e0b" stroke-width="4"/>
  <line x1="300" y1="280" x2="270" y2="300" stroke="#f59e0b" stroke-width="4"/>
  <line x1="300" y1="280" x2="330" y2="300" stroke="#f59e0b" stroke-width="4"/>
  <line x1="300" y1="275" x2="270" y2="265" stroke="#f59e0b" stroke-width="4"/>
  <line x1="300" y1="275" x2="330" y2="265" stroke="#f59e0b" stroke-width="4"/>
  
  <!-- Force Arrows -->
  <defs>
    <marker id="arrowBlue" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
      <polygon points="0 0, 12 3, 0 6" fill="#3b82f6"/>
    </marker>
    <marker id="arrowRed2" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
      <polygon points="0 0, 12 3, 0 6" fill="#ef4444"/>
    </marker>
  </defs>
  
  <!-- Action: Person pushes ground -->
  <line x1="300" y1="310" x2="300" y2="370" stroke="#3b82f6" stroke-width="5" marker-end="url(#arrowBlue)"/>
  <text x="320" y="345" fill="#3b82f6" font-size="16" font-weight="bold">Action</text>
  <text x="320" y="365" fill="#3b82f6" font-size="13">Person pushes ground</text>
  
  <!-- Reaction: Ground pushes person -->
  <line x1="300" y1="290" x2="300" y2="230" stroke="#ef4444" stroke-width="5" marker-end="url(#arrowRed2)"/>
  <text x="180" y="255" fill="#ef4444" font-size="16" font-weight="bold">Reaction</text>
  <text x="150" y="275" fill="#ef4444" font-size="13">Ground pushes person</text>
  
  <!-- Title -->
  <rect x="100" y="20" width="400" height="80" fill="#1f2937" stroke="#8b5cf6" stroke-width="3" rx="10"/>
  <text x="300" y="50" fill="#8b5cf6" font-size="24" text-anchor="middle" font-weight="bold">Newton\'s Third Law</text>
  <text x="300" y="75" fill="#9ca3af" font-size="14" text-anchor="middle">For every action, there is an equal</text>
  <text x="300" y="92" fill="#9ca3af" font-size="14" text-anchor="middle">and opposite reaction</text>
  
  <!-- Note -->
  <text x="300" y="390" fill="#f59e0b" font-size="13" text-anchor="middle" font-weight="bold">Forces act on DIFFERENT objects!</text>
</svg>`,
        description: 'Newton\'s Third Law: When you push on the ground, the ground pushes back with equal force in opposite direction. This is why you can walk!'
      },
      {
        type: 'svg',
        title: 'Free Body Diagram Example',
        content: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Box on incline -->
  <line x1="50" y1="300" x2="450" y2="150" stroke="#6b7280" stroke-width="4"/>
  <rect x="200" y="180" width="60" height="60" fill="#3b82f6" stroke="#1e40af" stroke-width="3" transform="rotate(-20 230 210)"/>
  
  <!-- Force vectors -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="currentColor"/>
    </marker>
  </defs>
  
  <!-- Weight (down) -->
  <line x1="230" y1="210" x2="230" y2="310" stroke="#ef4444" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="240" y="265" fill="#ef4444" font-size="16" font-weight="bold">W = mg</text>
  
  <!-- Normal force (perpendicular to surface) -->
  <line x1="230" y1="210" x2="180" y2="140" stroke="#10b981" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="150" y="165" fill="#10b981" font-size="16" font-weight="bold">N</text>
  
  <!-- Friction (up the incline) -->
  <line x1="230" y1="210" x2="310" y2="170" stroke="#f59e0b" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="320" y="185" fill="#f59e0b" font-size="16" font-weight="bold">f</text>
  
  <!-- Labels -->
  <text x="250" y="30" fill="#1f2937" font-size="20" font-weight="bold">Free Body Diagram</text>
  <text x="250" y="55" fill="#6b7280" font-size="14">Shows all forces on object</text>
  
  <!-- Legend -->
  <rect x="30" y="330" width="200" height="60" fill="#f3f4f6" rx="5"/>
  <line x1="40" y1="345" x2="70" y2="345" stroke="#ef4444" stroke-width="3"/>
  <text x="80" y="350" fill="#1f2937" font-size="12">Weight (gravity)</text>
  <line x1="40" y1="365" x2="70" y2="365" stroke="#10b981" stroke-width="3"/>
  <text x="80" y="370" fill="#1f2937" font-size="12">Normal force</text>
  <line x1="40" y1="385" x2="70" y2="385" stroke="#f59e0b" stroke-width="3"/>
  <text x="80" y="390" fill="#1f2937" font-size="12">Friction</text>
</svg>`,
        description: 'Free body diagrams show all forces acting on an object. This helps analyze motion using F = ma for each direction.'
      }
    ],

    examples: [
      {
        question: 'A 5 kg box is pushed with a force of 20 N. What is its acceleration?',
        solution: 'a = 4 m/s²',
        steps: [
          'Use Newton\'s Second Law: F = ma',
          'Given: F = 20 N, m = 5 kg',
          'Rearrange: a = F/m',
          'Substitute: a = 20 N / 5 kg',
          'Calculate: a = 4 m/s²',
          'The box accelerates at 4 meters per second squared'
        ]
      },
      {
        question: 'A 1000 kg car accelerates from rest to 20 m/s in 5 seconds. Find the net force.',
        solution: 'F = 4000 N',
        steps: [
          'First find acceleration: a = (v - v₀) / t',
          'a = (20 - 0) / 5 = 4 m/s²',
          'Use F = ma',
          'F = 1000 kg × 4 m/s²',
          'F = 4000 N',
          'The net force is 4000 Newtons'
        ]
      },
      {
        question: 'A rocket expels 100 kg of gas backward at 500 m/s. What force propels the rocket?',
        solution: 'F = 50,000 N (by Third Law)',
        steps: [
          'Use Newton\'s Third Law: action-reaction pairs',
          'Gas is pushed backward with force F',
          'Rocket is pushed forward with same force F',
          'Using impulse: F = Δ(mv) / Δt',
          'Assuming Δt = 1 second: F = 100 × 500 / 1',
          'F = 50,000 N forward on rocket'
        ]
      }
    ],

    keyPoints: [
      'First Law: Objects resist changes in motion (inertia)',
      'Second Law: F = ma connects force, mass, and acceleration',
      'Third Law: Forces come in action-reaction pairs',
      'Net force causes acceleration, not velocity',
      'More mass means more force needed for same acceleration',
      'Action-reaction forces act on DIFFERENT objects',
      'Free body diagrams help analyze complex situations'
    ],

    applications: [
      'Automotive Safety: Seatbelts, airbags, crumple zones use Newton\'s laws',
      'Rocket Science: Third law enables space travel',
      'Sports: Optimizing throwing, jumping, running techniques',
      'Engineering: Designing stable structures and machines',
      'Aviation: Understanding lift, thrust, drag forces',
      'Everyday Life: Walking, driving, pushing, pulling objects'
    ]
  },

  // ===== PHYSICS TOPIC 2: Energy & Work (FULL) =====
  {
    id: 'physics-energy-work',
    title: 'Energy, Work & Power',
    category: 'physics',
    difficulty: 'intermediate',
    icon: '⚡',
    description: 'Understand energy transformations, work done by forces, and the power of machines.',
    
    theory: `**Energy** is the capacity to do work. It's one of the most fundamental concepts in physics and is conserved in all physical processes.

**Forms of Energy:**

**1. Kinetic Energy (KE):** Energy of motion
- Formula: KE = ½mv²
- Depends on mass and speed
- Example: A moving car, flowing water, flying baseball

**2. Potential Energy (PE):** Stored energy due to position
- Gravitational PE: PE = mgh (height above ground)
- Elastic PE: PE = ½kx² (compressed/stretched spring)
- Example: Water at top of waterfall, stretched rubber band

**3. Other Forms:**
- Thermal energy (heat)
- Chemical energy (batteries, food)
- Electrical energy
- Nuclear energy
- Light energy

**Work:**
Work is done when a force causes displacement in the direction of the force.

**Formula:** W = F·d·cos(θ)
- W = work done (Joules)
- F = force applied
- d = displacement
- θ = angle between force and displacement

**Key Insights:**
- If force perpendicular to motion → W = 0 (no work!)
- If force opposite to motion → W < 0 (negative work)
- Only component of force in direction of motion does work

**Conservation of Energy:**
**The total energy in an isolated system remains constant.**

Energy can transform between different forms, but never created or destroyed!

**Examples:**
- Pendulum: PE ⟷ KE constantly converts
- Roller coaster: PE at top → KE at bottom
- Electric motor: Electrical → Kinetic
- Photosynthesis: Light → Chemical

**Power:**
Power is the rate at which work is done or energy is transferred.

**Formula:** P = W/t or P = F·v

**Units:** Watt (W) = Joule/second
- 1 horsepower = 746 Watts

**Why This Matters:**
- Same work, less time = More power
- Efficient machines maximize useful work output
- Understanding energy helps solve real-world problems`,

    formulas: [
      'KE = ½mv² --- Kinetic Energy',
      'PE = mgh --- Gravitational Potential Energy',
      'PE = ½kx² --- Elastic Potential Energy (springs)',
      'W = F·d·cos(θ) --- Work done by force',
      'W = ΔKE --- Work-Energy Theorem',
      'E_total = KE + PE = constant --- Conservation of Energy',
      'P = W/t --- Power (rate of doing work)',
      'P = F·v --- Power from force and velocity',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Energy Conservation - Pendulum',
        content: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Pivot point -->
  <circle cx="250" cy="50" r="8" fill="#1f2937"/>
  
  <!-- Left position (max height) -->
  <line x1="250" y1="50" x2="150" y2="200" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5"/>
  <circle cx="150" cy="200" r="20" fill="#3b82f6" opacity="0.5"/>
  <text x="150" y="240" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">High PE</text>
  <text x="150" y="255" fill="#3b82f6" font-size="12" text-anchor="middle">Low KE</text>
  
  <!-- Center position (lowest) -->
  <line x1="250" y1="50" x2="250" y2="250" stroke="#6b7280" stroke-width="3"/>
  <circle cx="250" cy="250" r="20" fill="#10b981"/>
  <text x="250" y="290" fill="#10b981" font-size="14" text-anchor="middle" font-weight="bold">Low PE</text>
  <text x="250" y="305" fill="#10b981" font-size="12" text-anchor="middle">High KE</text>
  <text x="250" y="325" fill="#10b981" font-size="13" text-anchor="middle" font-weight="bold">v_max</text>
  
  <!-- Right position (max height) -->
  <line x1="250" y1="50" x2="350" y2="200" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5"/>
  <circle cx="350" cy="200" r="20" fill="#3b82f6" opacity="0.5"/>
  <text x="350" y="240" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">High PE</text>
  <text x="350" y="255" fill="#3b82f6" font-size="12" text-anchor="middle">Low KE</text>
  
  <!-- Energy equation -->
  <rect x="100" y="350" width="300" height="40" fill="#1f2937" rx="8"/>
  <text x="250" y="375" fill="#fbbf24" font-size="16" text-anchor="middle" font-weight="bold">Total Energy = PE + KE = Constant</text>
  
  <!-- Title -->
  <text x="250" y="25" fill="#1f2937" font-size="18" text-anchor="middle" font-weight="bold">Pendulum Energy Conversion</text>
  
  <!-- Arrows showing motion -->
  <path d="M 180 180 Q 215 220 240 245" stroke="#ef4444" stroke-width="2" fill="none" marker-end="url(#arrowRed)"/>
  <path d="M 320 180 Q 285 220 260 245" stroke="#ef4444" stroke-width="2" fill="none" marker-end="url(#arrowRed)"/>
  
  <defs>
    <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#ef4444"/>
    </marker>
  </defs>
</svg>`,
        description: 'Pendulum demonstrates energy conservation: PE converts to KE and back. Total energy stays constant (ignoring friction).'
      },
      {
        type: 'svg',
        title: 'Work Done by Force',
        content: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Ground -->
  <line x1="50" y1="200" x2="550" y2="200" stroke="#6b7280" stroke-width="3"/>
  
  <!-- Box at start -->
  <rect x="80" y="150" width="60" height="50" fill="#3b82f6" stroke="#1e40af" stroke-width="2" opacity="0.3"/>
  <text x="110" y="180" fill="white" font-size="14" text-anchor="middle">Start</text>
  
  <!-- Box at end -->
  <rect x="420" y="150" width="60" height="50" fill="#10b981" stroke="#059669" stroke-width="3"/>
  <text x="450" y="180" fill="white" font-size="14" text-anchor="middle" font-weight="bold">End</text>
  
  <!-- Force arrow -->
  <defs>
    <marker id="arrowForce" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto">
      <polygon points="0 0, 12 3, 0 6" fill="#ef4444"/>
    </marker>
  </defs>
  <line x1="150" y1="175" x2="410" y2="175" stroke="#ef4444" stroke-width="4" marker-end="url(#arrowForce)"/>
  <text x="280" y="165" fill="#ef4444" font-size="18" text-anchor="middle" font-weight="bold">Force F</text>
  
  <!-- Displacement arrow -->
  <line x1="110" y1="230" x2="450" y2="230" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="5,5"/>
  <text x="280" y="250" fill="#8b5cf6" font-size="16" text-anchor="middle" font-weight="bold">Displacement d</text>
  
  <!-- Work formula -->
  <rect x="150" y="30" width="300" height="80" fill="#1f2937" stroke="#fbbf24" stroke-width="3" rx="10"/>
  <text x="300" y="60" fill="#fbbf24" font-size="24" text-anchor="middle" font-weight="bold">W = F · d · cos(θ)</text>
  <text x="300" y="85" fill="#9ca3af" font-size="13" text-anchor="middle">Work = Force × Displacement × cos(angle)</text>
  <text x="300" y="102" fill="#9ca3af" font-size="13" text-anchor="middle">If parallel (θ=0°): W = F · d</text>
</svg>`,
        description: 'Work is done when a force causes displacement. Maximum work when force is parallel to motion.'
      },
      {
        type: 'svg',
        title: 'Kinetic vs Potential Energy',
        content: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Roller coaster track -->
  <path d="M 50 300 L 100 300 Q 150 100 200 150 Q 250 200 300 100 Q 350 50 400 120 L 450 180" 
        stroke="#6b7280" stroke-width="4" fill="none"/>
  
  <!-- Cart at different positions -->
  <!-- Position 1: Top (high PE) -->
  <circle cx="200" cy="150" r="15" fill="#3b82f6"/>
  <text x="200" y="130" fill="#3b82f6" font-size="12" text-anchor="middle" font-weight="bold">PE = max</text>
  <text x="200" y="190" fill="#3b82f6" font-size="12" text-anchor="middle">KE = min</text>
  
  <!-- Position 2: Bottom (high KE) -->
  <circle cx="250" cy="200" r="15" fill="#10b981"/>
  <text x="250" y="225" fill="#10b981" font-size="12" text-anchor="middle" font-weight="bold">KE = high</text>
  <text x="250" y="240" fill="#10b981" font-size="12" text-anchor="middle">PE = low</text>
  
  <!-- Position 3: Peak (high PE) -->
  <circle cx="300" cy="100" r="15" fill="#3b82f6"/>
  <text x="300" y="80" fill="#3b82f6" font-size="12" text-anchor="middle" font-weight="bold">PE = max</text>
  <text x="300" y="140" fill="#3b82f6" font-size="12" text-anchor="middle">KE = min</text>
  
  <!-- Height reference -->
  <line x1="30" y1="300" x2="30" y2="100" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="15" y="200" fill="#f59e0b" font-size="14" transform="rotate(-90 15 200)">Height (h)</text>
  
  <!-- Energy bar graph -->
  <rect x="50" y="320" width="400" height="70" fill="#1f2937" rx="5"/>
  <text x="250" y="340" fill="white" font-size="14" text-anchor="middle" font-weight="bold">Total Energy = PE + KE</text>
  
  <!-- PE bar -->
  <rect x="70" y="350" width="150" height="25" fill="#3b82f6"/>
  <text x="145" y="367" fill="white" font-size="12" text-anchor="middle">PE = mgh</text>
  
  <!-- KE bar -->
  <rect x="240" y="350" width="190" height="25" fill="#10b981"/>
  <text x="335" y="367" fill="white" font-size="12" text-anchor="middle">KE = ½mv²</text>
  
  <!-- Title -->
  <text x="250" y="25" fill="#1f2937" font-size="18" text-anchor="middle" font-weight="bold">Roller Coaster Energy</text>
  <text x="250" y="45" fill="#6b7280" font-size="13" text-anchor="middle">Energy converts between PE and KE</text>
</svg>`,
        description: 'Roller coaster shows energy conservation: High PE at peaks converts to KE in valleys. Total energy constant.'
      }
    ],

    examples: [
      {
        question: 'A 2 kg ball falls from 10 m height. Find its speed just before hitting ground.',
        solution: 'v ≈ 14 m/s',
        steps: [
          'Use conservation of energy: PE_initial = KE_final',
          'mgh = ½mv²',
          'Mass cancels: gh = ½v²',
          'Solve for v: v = √(2gh)',
          'Substitute: v = √(2 × 10 × 10)',
          'v = √200 ≈ 14.14 m/s'
        ]
      },
      {
        question: 'A 50 kg person pushes a box 5 m with 100 N force. How much work is done?',
        solution: 'W = 500 J',
        steps: [
          'Use W = F·d (assuming force parallel to motion)',
          'Given: F = 100 N, d = 5 m',
          'W = 100 N × 5 m',
          'W = 500 J (Joules)',
          'The person does 500 Joules of work'
        ]
      },
      {
        question: 'A 1000 W motor lifts a 50 kg object 20 m high. How long does it take?',
        solution: 't = 9.8 seconds',
        steps: [
          'Work done = PE gained = mgh',
          'W = 50 × 10 × 20 = 10,000 J',
          'Power P = W/t, so t = W/P',
          't = 10,000 J / 1000 W',
          't = 10 seconds',
          'Motor takes 10 seconds to lift the object'
        ]
      }
    ],

    keyPoints: [
      'Energy is the capacity to do work (measured in Joules)',
      'Kinetic energy: KE = ½mv² (energy of motion)',
      'Potential energy: PE = mgh (energy due to position)',
      'Total energy is conserved in isolated systems',
      'Work = Force × Displacement × cos(angle)',
      'Power = Work / Time (rate of energy transfer)',
      'Energy transforms between forms but never destroyed'
    ],

    applications: [
      'Renewable Energy: Hydroelectric dams, wind turbines convert PE/KE to electricity',
      'Transportation: Cars convert chemical energy to kinetic energy',
      'Building Design: Elevators, escalators optimize power consumption',
      'Sports: Athletes maximize energy efficiency in movements',
      'Power Plants: Transform various energy forms to electrical energy',
      'Everyday Devices: Batteries store chemical energy for later use'
    ]
  },

  // ===== PHYSICS TOPIC 3: Waves & Sound (FULL) =====
  {
    id: 'physics-waves-sound',
    title: 'Waves & Sound',
    category: 'physics',
    difficulty: 'intermediate',
    icon: '🌊',
    description: 'Explore wave properties, sound propagation, and phenomena like resonance and Doppler effect.',
    
    theory: `**Waves** are disturbances that transfer energy through space and matter without transferring matter itself.

**Types of Waves:**

**1. Mechanical Waves** (require medium):
- Sound waves (air, water, solids)
- Water waves
- Seismic waves (earthquakes)
- Waves on strings

**2. Electromagnetic Waves** (no medium needed):
- Light
- Radio waves
- X-rays
- Microwaves

**Wave Classifications:**

**Transverse Waves:** Oscillation perpendicular to direction of travel
- Example: Light, water surface waves, waves on string
- Have crests (peaks) and troughs (valleys)

**Longitudinal Waves:** Oscillation parallel to direction of travel
- Example: Sound waves
- Have compressions and rarefactions

**Wave Properties:**

**Wavelength (λ):** Distance between consecutive crests or compressions
**Frequency (f):** Number of waves passing a point per second (Hertz)
**Amplitude (A):** Maximum displacement from equilibrium
**Speed (v):** How fast wave travels through medium

**Wave Equation:** v = f·λ
This fundamental equation relates speed, frequency, and wavelength!

**Sound Waves:**

Sound is a longitudinal mechanical wave that travels through compressions and rarefactions of the medium.

**Speed of Sound:**
- Air (20°C): ~343 m/s
- Water: ~1500 m/s
- Steel: ~5000 m/s
- Vacuum: 0 m/s (sound cannot travel!)

**Pitch and Loudness:**
- **Pitch:** Determined by frequency (high frequency = high pitch)
- **Loudness:** Determined by amplitude (large amplitude = loud)

**Doppler Effect:**
Change in frequency due to relative motion between source and observer.
- Approaching: Higher frequency (higher pitch)
- Receding: Lower frequency (lower pitch)
- Example: Ambulance siren changes pitch as it passes

**Resonance:**
When an object vibrates at its natural frequency, causing large amplitude oscillations.
- Examples: Musical instruments, breaking glass with sound, bridge collapse`,

    formulas: [
      'v = f·λ --- Wave equation (speed = frequency × wavelength)',
      'T = 1/f --- Period (time for one complete wave)',
      'v_sound ≈ 343 m/s --- Speed of sound in air at 20°C',
      'I ∝ A² --- Intensity proportional to amplitude squared',
      'f_observed = f_source × (v ± v_observer)/(v ∓ v_source) --- Doppler Effect',
      'β = 10·log₁₀(I/I₀) --- Sound intensity level (decibels)',
      'f₁ = v/2L --- Fundamental frequency of string (L = length)',
      'f_n = n·f₁ --- Harmonics (n = 1, 2, 3, ...)',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Transverse Wave Anatomy',
        content: `<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Wave curve -->
  <path d="M 50 175 Q 100 75, 150 175 Q 200 275, 250 175 Q 300 75, 350 175 Q 400 275, 450 175 Q 500 75, 550 175" 
        stroke="#3b82f6" stroke-width="4" fill="none"/>
  
  <!-- Equilibrium line -->
  <line x1="40" y1="175" x2="560" y2="175" stroke="#6b7280" stroke-width="1" stroke-dasharray="5,5"/>
  <text x="570" y="180" fill="#6b7280" font-size="12">Equilibrium</text>
  
  <!-- Wavelength -->
  <line x1="150" y1="300" x2="450" y2="300" stroke="#10b981" stroke-width="3"/>
  <circle cx="150" cy="300" r="4" fill="#10b981"/>
  <circle cx="450" cy="300" r="4" fill="#10b981"/>
  <line x1="150" y1="175" x2="150" y2="295" stroke="#10b981" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="450" y1="175" x2="450" y2="295" stroke="#10b981" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="300" y="325" fill="#10b981" font-size="18" text-anchor="middle" font-weight="bold">Wavelength λ</text>
  
  <!-- Amplitude -->
  <line x1="520" y1="175" x2="520" y2="75" stroke="#ef4444" stroke-width="3"/>
  <defs>
    <marker id="arrowAmp" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#ef4444"/>
    </marker>
  </defs>
  <line x1="520" y1="175" x2="520" y2="85" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowAmp)"/>
  <text x="535" y="130" fill="#ef4444" font-size="16" font-weight="bold">Amplitude A</text>
  
  <!-- Crest and Trough labels -->
  <text x="350" y="60" fill="#8b5cf6" font-size="16" font-weight="bold">Crest</text>
  <circle cx="350" cy="75" r="6" fill="#8b5cf6"/>
  <line x1="350" y1="81" x2="350" y2="170" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="2,2"/>
  
  <text x="250" y="300" fill="#f59e0b" font-size="16" font-weight="bold">Trough</text>
  <circle cx="250" cy="275" r="6" fill="#f59e0b"/>
  <line x1="250" y1="269" x2="250" y2="180" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2"/>
  
  <!-- Direction of travel -->
  <line x1="50" y1="30" x2="150" y2="30" stroke="#1f2937" stroke-width="3" marker-end="url(#arrowTravel)"/>
  <text x="100" y="20" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Wave travels →</text>
  <marker id="arrowTravel" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
    <polygon points="0 0, 10 5, 0 10" fill="#1f2937"/>
  </marker>
</svg>`,
        description: 'Transverse wave showing wavelength (λ), amplitude (A), crest, and trough. Particles oscillate perpendicular to wave direction.'
      },
      {
        type: 'svg',
        title: 'Longitudinal Wave (Sound)',
        content: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Particles at different densities -->
  <!-- Compression regions -->
  <g id="compression1">
    ${Array.from({length: 15}, (_, i) => 
      `<circle cx="${100 + i*5}" cy="150" r="3" fill="#ef4444"/>`
    ).join('')}
  </g>
  <text x="135" y="120" fill="#ef4444" font-size="14" font-weight="bold">Compression</text>
  
  <!-- Rarefaction -->
  <g id="rarefaction1">
    ${Array.from({length: 8}, (_, i) => 
      `<circle cx="${180 + i*10}" cy="150" r="3" fill="#3b82f6"/>`
    ).join('')}
  </g>
  <text x="210" y="120" fill="#3b82f6" font-size="14" font-weight="bold">Rarefaction</text>
  
  <!-- Compression regions -->
  <g id="compression2">
    ${Array.from({length: 15}, (_, i) => 
      `<circle cx="${265 + i*5}" cy="150" r="3" fill="#ef4444"/>`
    ).join('')}
  </g>
  <text x="300" y="120" fill="#ef4444" font-size="14" font-weight="bold">Compression</text>
  
  <!-- Rarefaction -->
  <g id="rarefaction2">
    ${Array.from({length: 8}, (_, i) => 
      `<circle cx="${345 + i*10}" cy="150" r="3" fill="#3b82f6"/>`
    ).join('')}
  </g>
  
  <!-- Compression -->
  <g id="compression3">
    ${Array.from({length: 15}, (_, i) => 
      `<circle cx="${430 + i*5}" cy="150" r="3" fill="#ef4444"/>`
    ).join('')}
  </g>
  
  <!-- Wavelength -->
  <line x1="115" y1="200" x2="280" y2="200" stroke="#10b981" stroke-width="3"/>
  <circle cx="115" cy="200" r="4" fill="#10b981"/>
  <circle cx="280" cy="200" r="4" fill="#10b981"/>
  <text x="197" y="225" fill="#10b981" font-size="16" text-anchor="middle" font-weight="bold">Wavelength λ</text>
  
  <!-- Direction arrow -->
  <line x1="50" y1="40" x2="150" y2="40" stroke="#1f2937" stroke-width="3" marker-end="url(#arrow2)"/>
  <text x="100" y="30" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Sound travels →</text>
  <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
    <polygon points="0 0, 10 5, 0 10" fill="#1f2937"/>
  </marker>
  
  <!-- Info box -->
  <rect x="50" y="250" width="500" height="40" fill="#1f2937" rx="5"/>
  <text x="300" y="275" fill="white" font-size="13" text-anchor="middle">Particles oscillate PARALLEL to wave direction (longitudinal)</text>
</svg>`,
        description: 'Sound wave is longitudinal: particles oscillate back and forth, creating regions of compression (high density) and rarefaction (low density).'
      },
      {
        type: 'svg',
        title: 'Doppler Effect',
        content: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Sound source (moving car) -->
  <rect x="260" y="120" width="80" height="40" fill="#ef4444" stroke="#dc2626" stroke-width="3" rx="5"/>
  <circle cx="275" cy="165" r="10" fill="#1f2937"/>
  <circle cx="325" cy="165" r="10" fill="#1f2937"/>
  <text x="300" y="145" fill="white" font-size="16" text-anchor="middle" font-weight="bold">🚗</text>
  
  <!-- Motion arrow -->
  <line x1="350" y1="140" x2="420" y2="140" stroke="#fbbf24" stroke-width="4" marker-end="url(#arrowMove)"/>
  <text x="385" y="130" fill="#fbbf24" font-size="14" font-weight="bold">Moving →</text>
  <marker id="arrowMove" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
    <polygon points="0 0, 10 5, 0 10" fill="#fbbf24"/>
  </marker>
  
  <!-- Sound waves (compressed ahead, stretched behind) -->
  <!-- Behind (stretched) -->
  <circle cx="200" cy="140" r="40" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="200" cy="140" r="65" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.7"/>
  <circle cx="200" cy="140" r="90" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.4"/>
  
  <!-- Ahead (compressed) -->
  <circle cx="400" cy="140" r="25" fill="none" stroke="#ef4444" stroke-width="3"/>
  <circle cx="400" cy="140" r="45" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.7"/>
  <circle cx="400" cy="140" r="65" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.4"/>
  
  <!-- Observer behind -->
  <text x="130" y="145" fill="#1f2937" font-size="32">🧍</text>
  <text x="130" y="180" fill="#3b82f6" font-size="12" text-anchor="middle" font-weight="bold">Low frequency</text>
  <text x="130" y="195" fill="#3b82f6" font-size="11" text-anchor="middle">(low pitch)</text>
  
  <!-- Observer ahead -->
  <text x="470" y="145" fill="#1f2937" font-size="32">🧍</text>
  <text x="470" y="180" fill="#ef4444" font-size="12" text-anchor="middle" font-weight="bold">High frequency</text>
  <text x="470" y="195" fill="#ef4444" font-size="11" text-anchor="middle">(high pitch)</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Doppler Effect</text>
  <text x="300" y="50" fill="#6b7280" font-size="13" text-anchor="middle">Frequency changes due to motion</text>
  
  <!-- Info -->
  <rect x="100" y="230" width="400" height="60" fill="#f3f4f6" rx="5"/>
  <text x="300" y="250" fill="#1f2937" font-size="12" text-anchor="middle">Moving toward observer: waves compressed → higher frequency</text>
  <text x="300" y="265" fill="#1f2937" font-size="12" text-anchor="middle">Moving away: waves stretched → lower frequency</text>
  <text x="300" y="280" fill="#8b5cf6" font-size="11" text-anchor="middle" font-weight="bold">Example: Ambulance siren changes pitch as it passes you!</text>
</svg>`,
        description: 'Doppler Effect: Source moving toward observer produces higher frequency (shorter wavelength), away produces lower frequency.'
      }
    ],

    examples: [
      {
        question: 'A wave has frequency 100 Hz and wavelength 2 m. Find its speed.',
        solution: 'v = 200 m/s',
        steps: [
          'Use wave equation: v = f·λ',
          'Given: f = 100 Hz, λ = 2 m',
          'Substitute: v = 100 × 2',
          'v = 200 m/s',
          'The wave travels at 200 meters per second'
        ]
      },
      {
        question: 'Sound travels at 343 m/s. What is the wavelength of a 256 Hz tone (middle C)?',
        solution: 'λ ≈ 1.34 m',
        steps: [
          'Use v = f·λ, rearrange to λ = v/f',
          'Given: v = 343 m/s, f = 256 Hz',
          'Substitute: λ = 343 / 256',
          'λ ≈ 1.34 meters',
          'Middle C has wavelength of 1.34 meters'
        ]
      },
      {
        question: 'Why can\'t you hear sound in space?',
        solution: 'No medium for sound waves to travel through',
        steps: [
          'Sound is a mechanical wave',
          'Mechanical waves require a medium (air, water, solid)',
          'Space is a vacuum (no air molecules)',
          'Without molecules, no compressions/rarefactions',
          'Therefore, sound cannot propagate in space',
          'Movies with space explosions are scientifically inaccurate!'
        ]
      }
    ],

    keyPoints: [
      'Waves transfer energy without transferring matter',
      'Transverse: oscillation perpendicular to travel (light, string)',
      'Longitudinal: oscillation parallel to travel (sound)',
      'Wave equation: v = f·λ relates speed, frequency, wavelength',
      'Sound needs a medium, cannot travel in vacuum',
      'Doppler Effect: frequency changes due to relative motion',
      'Resonance occurs at natural frequency of system'
    ],

    applications: [
      'Medical Imaging: Ultrasound uses high-frequency sound waves',
      'Music: Instruments use resonance and wave interference',
      'Communication: Radio waves, WiFi, cellular networks',
      'Radar & Sonar: Detect objects using reflected waves',
      'Earthquake Detection: Seismometers measure seismic waves',
      'Noise Cancellation: Uses destructive interference of sound waves'
    ]
  },

  // ===== PHYSICS TOPIC 4: Electricity & Magnetism (THEORY ONLY) =====
  {
    id: 'physics-electromagnetism',
    title: 'Electricity & Magnetism',
    category: 'physics',
    difficulty: 'advanced',
    icon: '⚡',
    description: 'Understanding electric charges, circuits, magnetic fields, and electromagnetic phenomena.',
    
    theory: `**Electricity and Magnetism** are two interconnected fundamental forces of nature, unified in electromagnetism.

**Electric Charge:**
- Two types: Positive (+) and Negative (-)
- Like charges repel, unlike charges attract
- Charge is conserved (never created or destroyed)
- Unit: Coulomb (C)
- Elementary charge: e = 1.6 × 10⁻¹⁹ C (proton/electron)

**Electric Current:**
Flow of electric charge through a conductor.
- I = Q/t (current = charge per time)
- Unit: Ampere (A) = Coulomb/second
- Direction: Conventional current flows from + to -
- In metals: Electrons flow opposite to current direction

**Voltage (Potential Difference):**
Energy per unit charge, "electric pressure" that drives current.
- V = W/Q (voltage = work per charge)
- Unit: Volt (V) = Joule/Coulomb
- Battery provides voltage to push charges through circuit

**Resistance:**
Opposition to current flow in a material.
- R = V/I (Ohm's Law)
- Unit: Ohm (Ω)
- Depends on: material, length, cross-sectional area, temperature

**Electric Circuits:**
- **Series:** Same current through all components, voltages add
- **Parallel:** Same voltage across all components, currents add
- **Power:** P = VI = I²R = V²/R (energy per time)

**Magnetism:**
- Magnetic poles always come in pairs (N-S)
- Like poles repel, unlike poles attract
- Cannot isolate a single pole (no magnetic monopoles)
- Moving charges create magnetic fields
- Magnetic fields exert forces on moving charges

**Electromagnetic Induction:**
Changing magnetic field induces electric current (Faraday's Law)
- Basis for: Generators, transformers, induction cooktops
- Electric motors: Reverse process (current creates magnetic field, causing motion)

**Applications:**
- **Power Generation:** Generators convert mechanical to electrical energy
- **Motors:** Convert electrical to mechanical energy
- **Transformers:** Change AC voltage levels
- **Electronics:** All modern devices use electric circuits
- **MRI Machines:** Use powerful electromagnets
- **Maglev Trains:** Magnetic levitation for high-speed travel`
  },

  // ===== PHYSICS TOPIC 5: Quantum Physics (THEORY ONLY) =====
  {
    id: 'physics-quantum',
    title: 'Introduction to Quantum Physics',
    category: 'physics',
    difficulty: 'advanced',
    icon: '⚛️',
    description: 'Explore the strange quantum world of particles, waves, and uncertainty.',
    
    theory: `**Quantum Physics** describes the behavior of matter and energy at the atomic and subatomic scale, where classical physics breaks down.

**Wave-Particle Duality:**
Light and matter exhibit both wave and particle properties!
- Light: Acts as waves (interference) AND particles (photons)
- Electrons: Act as particles AND waves (electron diffraction)
- Which behavior we see depends on how we measure it

**Photons:**
- Light comes in discrete packets called photons
- Energy of photon: E = hf (h = Planck's constant)
- Explains photoelectric effect: Light ejects electrons from metal
- Higher frequency → More energy per photon

**Heisenberg Uncertainty Principle:**
You cannot simultaneously know both position and momentum with perfect precision.
- Δx · Δp ≥ ℏ/2
- Not due to measurement limitations, but fundamental nature of reality!
- Observing changes the system

**Quantum Superposition:**
Particles can exist in multiple states simultaneously until measured.
- Schrödinger's Cat: Famous thought experiment
- Electron can be "spin up" AND "spin down" at same time
- Measurement "collapses" superposition to definite state

**Quantum Tunneling:**
Particles can pass through barriers they classically shouldn't be able to.
- Explains: Radioactive decay, how Sun produces energy
- Used in: Scanning tunneling microscopes, flash memory

**Quantum Entanglement:**
Two particles can be correlated such that measuring one instantly affects the other, no matter the distance!
- Einstein called it "spooky action at a distance"
- No information travels faster than light
- Used in: Quantum computing, quantum cryptography

**Energy Levels in Atoms:**
Electrons can only occupy discrete energy levels (quantized)
- Cannot have arbitrary energy, only specific values
- Jumping between levels emits/absorbs photons
- Explains: Atomic spectra, why atoms are stable

**Applications:**
- **Semiconductors:** Basis of all modern electronics
- **Lasers:** Use quantum properties of light
- **Quantum Computing:** Harness superposition for computation
- **MRI & PET Scans:** Use quantum nuclear properties
- **Solar Cells:** Photoelectric effect converts light to electricity
- **LED Lights:** Quantum transitions emit light efficiently

**Why Quantum Physics Matters:**
Without quantum mechanics, we couldn't explain:
- Why atoms don't collapse
- How chemical bonds form
- Why metals conduct electricity
- How lasers work
- Why Sun shines

Quantum physics is the foundation of modern technology and our understanding of reality at the smallest scales!`
  },

  // ===== PHYSICS TOPIC 6: Thermodynamics (THEORY ONLY) =====
  {
    id: 'physics-thermodynamics',
    title: 'Thermodynamics & Heat Transfer',
    category: 'physics',
    difficulty: 'intermediate',
    icon: '🌡️',
    description: 'Study heat, temperature, and energy transfer - the physics behind engines, refrigerators, and the universe.',
    
    theory: `**Thermodynamics** is the study of heat, temperature, energy, and their transformations. It governs everything from engines to the fate of the universe.

**Temperature vs Heat:**
- **Temperature:** Measure of average kinetic energy of particles (how fast they move)
- **Heat:** Energy transfer between objects due to temperature difference
- Heat flows from hot to cold until thermal equilibrium

**The Four Laws of Thermodynamics:**

**Zeroth Law:** If A and B are in thermal equilibrium, and B and C are in thermal equilibrium, then A and C are in thermal equilibrium.
- Foundation for temperature measurement
- Defines temperature as a measurable property

**First Law (Energy Conservation):**
ΔU = Q - W
- ΔU = Change in internal energy
- Q = Heat added to system
- W = Work done by system
- Energy cannot be created or destroyed, only transformed

**Second Law (Entropy):**
The entropy of an isolated system always increases.
- Heat spontaneously flows from hot to cold, never reverse
- Energy quality degrades over time (heat → less useful)
- No perfect heat engine (some energy always wasted)
- Defines arrow of time (why time moves forward)

**Third Law:**
As temperature approaches absolute zero (0 K = -273.15°C), entropy approaches a minimum constant value.
- Absolute zero cannot be reached
- At absolute zero, particles have minimum possible energy

**Heat Transfer Mechanisms:**

1. **Conduction:** Direct contact transfer
   - Touching hot stove, metal spoon in hot coffee
   - Good conductors: Metals, bad: Air, wood, plastic

2. **Convection:** Transfer through fluid motion
   - Hot air rises, cold sinks (creates currents)
   - Boiling water, ocean currents, weather systems

3. **Radiation:** Electromagnetic wave transfer
   - Sun warming Earth across empty space
   - Infrared heat lamps, thermal imaging
   - No medium required!

**Specific Heat Capacity:**
Amount of heat needed to raise 1 kg of substance by 1°C
- Water has high specific heat (hard to heat up/cool down)
- Metals have low specific heat (heat up/cool down quickly)
- Why coastal areas have moderate climates

**Phase Changes:**
- Melting: Solid → Liquid (absorbs heat)
- Freezing: Liquid → Solid (releases heat)
- Vaporization: Liquid → Gas (absorbs heat)
- Condensation: Gas → Liquid (releases heat)
- Sublimation: Solid → Gas (dry ice)

**Heat Engines:**
Convert heat into mechanical work (cars, power plants)
- Efficiency = (Work Out) / (Heat In)
- Carnot efficiency: Maximum theoretical efficiency
- Always < 100% (Second Law!)

**Refrigerators & Heat Pumps:**
- Move heat from cold to hot (opposite of natural flow)
- Requires work input
- Your refrigerator warms your kitchen!

**Applications:**
- **Engines:** Cars, jets, rockets, power plants
- **HVAC Systems:** Heating, ventilation, air conditioning
- **Cooking:** Ovens, microwaves, induction cooktops
- **Weather:** Atmospheric convection drives weather
- **Cosmology:** Heat death of universe (maximum entropy)
- **Biology:** Body temperature regulation, metabolism
- **Insulation:** Keeping buildings energy-efficient

**Entropy & The Arrow of Time:**
Entropy always increases → defines direction of time
- Broken egg never spontaneously reassembles
- Mixed coffee and cream never unmix
- Stars burn out, universe expands and cools
- This is why we remember past but not future!

Thermodynamics explains why perpetual motion machines are impossible and why the universe evolves in one direction!`
  }
];

// ==================== CHEMISTRY (5 Topics) ====================

export const chemistryTopics: ModuleTopic[] = [
  // ===== CHEMISTRY TOPIC 1: Atomic Structure (FULL) =====
  {
    id: 'chemistry-atomic-structure',
    title: 'Atomic Structure',
    category: 'chemistry',
    difficulty: 'beginner',
    icon: '⚛️',
    description: 'Understand atoms, subatomic particles, electron configuration, and the periodic table.',
    
    theory: `**Atoms** are the fundamental building blocks of all matter. Everything around you is made of atoms!

**Structure of an Atom:**

**1. Nucleus (Center):**
- Contains protons (+) and neutrons (neutral)
- Nearly all the atom's mass is here
- Extremely tiny: ~10⁻¹⁵ m diameter

**2. Electron Cloud:**
- Electrons (-) orbit the nucleus in shells/orbitals
- Takes up most of atom's volume
- Atom diameter: ~10⁻¹⁰ m

**Subatomic Particles:**

**Protons:**
- Positive charge (+1)
- Mass: ~1 amu (atomic mass unit)
- Atomic number = number of protons
- Defines the element (e.g., 6 protons = Carbon)

**Neutrons:**
- No charge (neutral)
- Mass: ~1 amu (similar to proton)
- Isotopes have different neutron numbers
- Adds to atomic mass

**Electrons:**
- Negative charge (-1)
- Mass: ~1/1840 amu (nearly massless!)
- Number of electrons = number of protons (neutral atom)
- Determines chemical properties

**Electron Configuration:**
Electrons occupy specific energy levels (shells):
- **Shell 1 (K):** Max 2 electrons (closest to nucleus)
- **Shell 2 (L):** Max 8 electrons
- **Shell 3 (M):** Max 18 electrons
- **Shell 4 (N):** Max 32 electrons

**Filling Order:** Electrons fill lowest energy levels first
- Example: Carbon (6 electrons) → 2, 4 (2 in first shell, 4 in second)
- Example: Sodium (11 electrons) → 2, 8, 1

**Valence Electrons:**
Electrons in outermost shell - these determine chemical behavior!
- Noble gases have full outer shell (stable, unreactive)
- Other elements react to achieve full outer shell

**Ions:**
Atoms that gain or lose electrons become charged:
- **Cation:** Lost electron(s) → Positive charge (e.g., Na⁺)
- **Anion:** Gained electron(s) → Negative charge (e.g., Cl⁻)

**Isotopes:**
Same element (same protons) but different neutrons
- Carbon-12: 6 protons, 6 neutrons
- Carbon-14: 6 protons, 8 neutrons (radioactive)
- Same chemical properties, different mass

**The Periodic Table:**
Organized by atomic number (number of protons)
- **Groups (Columns):** Same valence electrons, similar properties
- **Periods (Rows):** Same number of electron shells
- **Metals:** Left and center (conduct electricity, malleable)
- **Nonmetals:** Right side (insulators, brittle as solids)
- **Metalloids:** Staircase line (intermediate properties)

**Why This Matters:**
Understanding atomic structure explains:
- Why elements have different properties
- How chemical bonds form
- Why periodic table is organized this way
- Nuclear energy and radioactivity
- How atoms combine to make molecules`,

    formulas: [
      'Atomic Number (Z) = Number of Protons',
      'Mass Number (A) = Protons + Neutrons',
      'Neutral Atom: Protons = Electrons',
      'Ion Charge = Protons - Electrons',
      'Number of Neutrons = Mass Number - Atomic Number',
      'Isotope Notation: ᴬ𝐗 ₍Z₎ (A = mass number, Z = atomic number)',
      'Maximum Electrons per Shell = 2n² (n = shell number)',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Atom Structure - Bohr Model',
        content: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Nucleus -->
  <circle cx="250" cy="250" r="30" fill="#ef4444" stroke="#dc2626" stroke-width="3"/>
  <text x="250" y="245" fill="white" font-size="12" text-anchor="middle" font-weight="bold">6p⁺</text>
  <text x="250" y="260" fill="white" font-size="12" text-anchor="middle" font-weight="bold">6n⁰</text>
  <text x="250" y="310" fill="#ef4444" font-size="14" text-anchor="middle" font-weight="bold">Nucleus</text>
  
  <!-- First electron shell -->
  <circle cx="250" cy="250" r="80" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5,5"/>
  <circle cx="330" cy="250" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="335" y="253" fill="#1f2937" font-size="16" font-weight="bold">e⁻</text>
  <circle cx="170" cy="250" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="175" y="253" fill="#1f2937" font-size="16" font-weight="bold">e⁻</text>
  <text x="150" y="250" fill="#3b82f6" font-size="12" font-weight="bold">Shell 1 (K)</text>
  
  <!-- Second electron shell -->
  <circle cx="250" cy="250" r="140" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="5,5"/>
  <circle cx="390" cy="250" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="395" y="253" fill="#1f2937" font-size="16" font-weight="bold">e⁻</text>
  <circle cx="250" cy="110" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="255" y="113" fill="#1f2937" font-size="16" font-weight="bold">e⁻</text>
  <circle cx="110" cy="250" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="115" y="253" fill="#1f2937" font-size="16" font-weight="bold">e⁻</text>
  <circle cx="250" cy="390" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="255" y="393" fill="#1f2937" font-size="16" font-weight="bold">e⁻</text>
  <text x="60" y="250" fill="#10b981" font-size="12" font-weight="bold">Shell 2 (L)</text>
  
  <!-- Title -->
  <text x="250" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Carbon Atom (¹²C)</text>
  <text x="250" y="50" fill="#6b7280" font-size="13" text-anchor="middle">6 protons, 6 neutrons, 6 electrons</text>
  
  <!-- Legend -->
  <rect x="20" y="430" width="460" height="60" fill="#f3f4f6" rx="5"/>
  <circle cx="40" cy="450" r="6" fill="#ef4444"/>
  <text x="55" y="455" fill="#1f2937" font-size="12">Protons (+) & Neutrons (neutral) in nucleus</text>
  <circle cx="40" cy="470" r="6" fill="#fbbf24"/>
  <text x="55" y="475" fill="#1f2937" font-size="12">Electrons (−) orbit in shells</text>
  <text x="290" y="455" fill="#6b7280" font-size="11">Electron config: 2, 4</text>
  <text x="290" y="475" fill="#8b5cf6" font-size="11" font-weight="bold">4 valence electrons</text>
</svg>`,
        description: 'Bohr model of carbon atom showing nucleus with protons and neutrons, surrounded by electron shells. Carbon has 6 protons, 6 neutrons, and 6 electrons.'
      },
      {
        type: 'svg',
        title: 'Subatomic Particles Comparison',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Proton -->
  <circle cx="150" cy="120" r="40" fill="#ef4444" stroke="#dc2626" stroke-width="3"/>
  <text x="150" y="130" fill="white" font-size="28" text-anchor="middle" font-weight="bold">p⁺</text>
  <text x="150" y="180" fill="#ef4444" font-size="18" text-anchor="middle" font-weight="bold">Proton</text>
  <text x="150" y="200" fill="#6b7280" font-size="12" text-anchor="middle">Charge: +1</text>
  <text x="150" y="215" fill="#6b7280" font-size="12" text-anchor="middle">Mass: 1 amu</text>
  <text x="150" y="230" fill="#6b7280" font-size="12" text-anchor="middle">Location: Nucleus</text>
  
  <!-- Neutron -->
  <circle cx="300" cy="120" r="40" fill="#6b7280" stroke="#4b5563" stroke-width="3"/>
  <text x="300" y="130" fill="white" font-size="28" text-anchor="middle" font-weight="bold">n⁰</text>
  <text x="300" y="180" fill="#6b7280" font-size="18" text-anchor="middle" font-weight="bold">Neutron</text>
  <text x="300" y="200" fill="#6b7280" font-size="12" text-anchor="middle">Charge: 0</text>
  <text x="300" y="215" fill="#6b7280" font-size="12" text-anchor="middle">Mass: 1 amu</text>
  <text x="300" y="230" fill="#6b7280" font-size="12" text-anchor="middle">Location: Nucleus</text>
  
  <!-- Electron -->
  <circle cx="450" cy="120" r="20" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/>
  <text x="450" y="128" fill="white" font-size="20" text-anchor="middle" font-weight="bold">e⁻</text>
  <text x="450" y="180" fill="#fbbf24" font-size="18" text-anchor="middle" font-weight="bold">Electron</text>
  <text x="450" y="200" fill="#6b7280" font-size="12" text-anchor="middle">Charge: -1</text>
  <text x="450" y="215" fill="#6b7280" font-size="12" text-anchor="middle">Mass: 1/1840 amu</text>
  <text x="450" y="230" fill="#6b7280" font-size="12" text-anchor="middle">Location: Shells</text>
  
  <!-- Size comparison -->
  <rect x="50" y="260" width="500" height="120" fill="#1f2937" rx="8"/>
  <text x="300" y="285" fill="white" font-size="16" text-anchor="middle" font-weight="bold">Key Facts:</text>
  <text x="300" y="310" fill="#9ca3af" font-size="13" text-anchor="middle">• Protons define the element (atomic number)</text>
  <text x="300" y="330" fill="#9ca3af" font-size="13" text-anchor="middle">• Neutrons add mass, create isotopes</text>
  <text x="300" y="350" fill="#9ca3af" font-size="13" text-anchor="middle">• Electrons determine chemical properties</text>
  <text x="300" y="370" fill="#fbbf24" font-size="12" text-anchor="middle" font-weight="bold">Atom is 99.9999% empty space!</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="22" text-anchor="middle" font-weight="bold">Subatomic Particles</text>
</svg>`,
        description: 'Comparison of three subatomic particles: protons (positive, in nucleus), neutrons (neutral, in nucleus), and electrons (negative, in shells).'
      },
      {
        type: 'svg',
        title: 'Ions Formation',
        content: `<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Neutral Sodium -->
  <circle cx="150" cy="120" r="20" fill="#ef4444"/>
  <circle cx="150" cy="120" r="50" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
  <circle cx="200" cy="120" r="6" fill="#fbbf24"/>
  <circle cx="150" cy="120" r="80" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3"/>
  <circle cx="230" cy="120" r="6" fill="#fbbf24"/>
  <circle cx="150" cy="200" r="6" fill="#fbbf24"/>
  <circle cx="70" cy="120" r="6" fill="#fbbf24"/>
  <circle cx="150" cy="40" r="6" fill="#fbbf24"/>
  <text x="150" y="240" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Na (neutral)</text>
  <text x="150" y="258" fill="#6b7280" font-size="11" text-anchor="middle">11 p⁺, 11 e⁻</text>
  <text x="150" cy="273" fill="#6b7280" font-size="11" text-anchor="middle">Config: 2, 8, 1</text>
  
  <!-- Arrow -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#8b5cf6"/>
    </marker>
  </defs>
  <line x1="270" y1="120" x2="330" y2="120" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="300" y="110" fill="#8b5cf6" font-size="12" text-anchor="middle" font-weight="bold">Loses 1 e⁻</text>
  
  <!-- Sodium Ion (cation) -->
  <circle cx="450" cy="120" r="20" fill="#ef4444"/>
  <text x="470" y="100" fill="#ef4444" font-size="20" font-weight="bold">+</text>
  <circle cx="450" cy="120" r="50" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
  <circle cx="500" cy="120" r="6" fill="#fbbf24"/>
  <circle cx="450" cy="170" r="6" fill="#fbbf24"/>
  <circle cx="400" cy="120" r="6" fill="#fbbf24"/>
  <text x="450" y="240" fill="#ef4444" font-size="14" text-anchor="middle" font-weight="bold">Na⁺ (cation)</text>
  <text x="450" y="258" fill="#6b7280" font-size="11" text-anchor="middle">11 p⁺, 10 e⁻</text>
  <text x="450" y="273" fill="#6b7280" font-size="11" text-anchor="middle">Config: 2, 8 (stable!)</text>
  
  <!-- Info box -->
  <rect x="50" y="300" width="500" height="40" fill="#f3f4f6" rx="5"/>
  <text x="300" y="320" fill="#1f2937" font-size="13" text-anchor="middle" font-weight="bold">Cation: Loses electron(s) → Positive charge</text>
  <text x="300" y="335" fill="#6b7280" font-size="11" text-anchor="middle">Metals typically form cations (Na⁺, Ca²⁺, Al³⁺)</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Ion Formation Example</text>
</svg>`,
        description: 'Sodium loses its outermost electron to become Na⁺ cation. This gives it a stable electron configuration (full outer shell).'
      }
    ],

    examples: [
      {
        question: 'How many protons, neutrons, and electrons are in ²³Na?',
        solution: '11 protons, 12 neutrons, 11 electrons',
        steps: [
          'Sodium (Na) has atomic number 11',
          'Atomic number = protons = 11',
          'Neutral atom: electrons = protons = 11',
          'Mass number (23) = protons + neutrons',
          'Neutrons = 23 - 11 = 12',
          'Answer: 11 p⁺, 12 n⁰, 11 e⁻'
        ]
      },
      {
        question: 'Write the electron configuration for Oxygen (atomic number 8).',
        solution: '2, 6 (or 1s² 2s² 2p⁴)',
        steps: [
          'Oxygen has 8 electrons',
          'Fill shells in order: lowest energy first',
          'Shell 1 (max 2): 2 electrons',
          'Shell 2 (max 8): 6 electrons remaining',
          'Configuration: 2, 6',
          'Oxygen has 6 valence electrons'
        ]
      },
      {
        question: 'What is the charge on an aluminum ion that lost 3 electrons?',
        solution: 'Al³⁺ (charge = +3)',
        steps: [
          'Aluminum atomic number = 13',
          'Neutral Al: 13 protons, 13 electrons',
          'Lost 3 electrons: 13 protons, 10 electrons',
          'Charge = protons - electrons',
          'Charge = 13 - 10 = +3',
          'Ion is Al³⁺ (cation)'
        ]
      }
    ],

    keyPoints: [
      'Atoms consist of protons (nucleus, +), neutrons (nucleus, 0), electrons (shells, -)',
      'Atomic number = number of protons (defines element)',
      'Mass number = protons + neutrons',
      'Electrons in outermost shell (valence) determine chemistry',
      'Ions form when atoms gain or lose electrons',
      'Isotopes have same protons, different neutrons',
      'Periodic table organized by atomic number and electron configuration'
    ],

    applications: [
      'Nuclear Power: Uses radioactive isotopes for energy',
      'Medical Imaging: PET scans use radioactive tracers',
      'Carbon Dating: Uses Carbon-14 isotope to date artifacts',
      'Semiconductors: Control electron flow in computer chips',
      'Battery Technology: Lithium-ion batteries use ion movement',
      'Water Treatment: Ion exchange removes contaminants'
    ]
  },

  // ===== CHEMISTRY TOPIC 2: Chemical Bonding (FULL) =====
  {
    id: 'chemistry-bonding',
    title: 'Chemical Bonding',
    category: 'chemistry',
    difficulty: 'intermediate',
    icon: '🔗',
    description: 'Learn how atoms bond together through ionic, covalent, and metallic bonds.',
    
    theory: `**Chemical Bonds** are forces that hold atoms together in compounds. Atoms bond to achieve stable electron configurations.

**Why Atoms Bond:**
Atoms want to have **full outer electron shells** like noble gases (stable!)
- Most stable: 8 valence electrons (octet rule)
- Exception: Hydrogen and Helium stable with 2 electrons

**Three Main Types of Bonds:**

**1. IONIC BONDS:**
Transfer of electrons from metal to nonmetal.

**How It Works:**
- Metal loses electrons → Becomes positive cation
- Nonmetal gains electrons → Becomes negative anion
- Opposite charges attract → Ionic bond forms

**Example: NaCl (Table Salt)**
- Na loses 1 electron → Na⁺
- Cl gains 1 electron → Cl⁻
- Na⁺ and Cl⁻ attract electrostatically

**Properties of Ionic Compounds:**
- High melting/boiling points (strong attractions)
- Hard but brittle (crystal structure)
- Conduct electricity when dissolved or melted (mobile ions)
- Usually soluble in water
- Form crystal lattices (regular 3D structure)

**2. COVALENT BONDS:**
Sharing of electrons between nonmetals.

**How It Works:**
- Both atoms need electrons
- Atoms share electron pairs
- Shared electrons count toward both atoms' octets

**Types of Covalent Bonds:**
- **Single bond:** Share 1 pair (2 electrons) — H-H
- **Double bond:** Share 2 pairs (4 electrons) — O=O
- **Triple bond:** Share 3 pairs (6 electrons) — N≡N

**Example: H₂O (Water)**
- Each H shares 1 electron with O
- O shares 2 electrons (one with each H)
- O achieves octet, H achieves duet

**Properties of Covalent Compounds:**
- Lower melting/boiling points than ionic
- Can be gases, liquids, or soft solids
- Don't conduct electricity (no free charges)
- Can be polar or nonpolar
- Form discrete molecules

**Polar vs Nonpolar Covalent:**
- **Nonpolar:** Equal sharing (same element or similar electronegativity)
- **Polar:** Unequal sharing (different electronegativities)
  - More electronegative atom pulls electrons closer
  - Creates partial charges (δ+ and δ-)
  - Example: H₂O is polar (O more electronegative than H)

**3. METALLIC BONDS:**
"Sea of electrons" shared among all metal atoms.

**How It Works:**
- Metal atoms lose valence electrons
- Electrons form delocalized "sea" that moves freely
- Positive metal ions held together by electron sea

**Properties of Metals:**
- Conduct electricity (mobile electrons)
- Conduct heat well
- Malleable (can be hammered into sheets)
- Ductile (can be drawn into wires)
- Lustrous (shiny)

**Electronegativity:**
Ability of atom to attract electrons in a bond
- Fluorine is most electronegative
- Increases left to right, decreases down periodic table
- Large difference → Ionic bond
- Small difference → Polar covalent
- No difference → Nonpolar covalent

**Bond Strength:**
- Triple > Double > Single (covalent)
- Ionic bonds generally very strong
- Hydrogen bonds: Special weak bond (important in water, DNA)

**Lewis Structures:**
Diagrams showing valence electrons and bonding
- Dots represent valence electrons
- Lines represent shared pairs (bonds)
- Shows how atoms achieve octets`,

    formulas: [
      'Octet Rule: Atoms want 8 valence electrons',
      'Ion Charge = Protons - Electrons',
      'Electronegativity Difference > 1.7 → Ionic',
      'Electronegativity Difference 0.4-1.7 → Polar Covalent',
      'Electronegativity Difference < 0.4 → Nonpolar Covalent',
      'Bond Order: Single (1), Double (2), Triple (3)',
      'Coulomb\'s Law: F = k(q₁q₂)/r² (ionic attraction force)',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Ionic Bonding - NaCl Formation',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Sodium atom -->
  <g id="Na-before">
    <circle cx="120" cy="120" r="15" fill="#ef4444"/>
    <circle cx="120" cy="120" r="40" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
    <circle cx="160" cy="120" r="5" fill="#fbbf24"/>
    <circle cx="120" cy="120" r="65" fill="none" stroke="#10b981" stroke-width="2"/>
    <circle cx="185" cy="120" r="5" fill="#fbbf24"/>
    <text x="120" y="200" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Na</text>
    <text x="120" y="218" fill="#6b7280" font-size="11" text-anchor="middle">11 p⁺, 11 e⁻</text>
    <text x="120" y="233" fill="#6b7280" font-size="10" text-anchor="middle">Config: 2, 8, 1</text>
  </g>
  
  <!-- Chlorine atom -->
  <g id="Cl-before">
    <circle cx="480" cy="120" r="15" fill="#10b981"/>
    <circle cx="480" cy="120" r="40" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
    <circle cx="520" cy="120" r="5" fill="#fbbf24"/>
    <circle cx="480" cy="120" r="65" fill="none" stroke="#10b981" stroke-width="2"/>
    ${[0,1,2,3,4,5,6].map((i) => {
      const angle = (i * 360 / 7) * Math.PI / 180;
      const x = 480 + 65 * Math.cos(angle);
      const y = 120 + 65 * Math.sin(angle);
      return `<circle cx="${x}" cy="${y}" r="5" fill="#fbbf24"/>`;
    }).join('')}
    <text x="480" y="200" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Cl</text>
    <text x="480" y="218" fill="#6b7280" font-size="11" text-anchor="middle">17 p⁺, 17 e⁻</text>
    <text x="480" y="233" fill="#6b7280" font-size="10" text-anchor="middle">Config: 2, 8, 7</text>
  </g>
  
  <!-- Electron transfer arrow -->
  <defs>
    <marker id="arrowElectron" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#8b5cf6"/>
    </marker>
  </defs>
  <line x1="200" y1="120" x2="410" y2="120" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrowElectron)"/>
  <circle cx="185" cy="120" r="5" fill="#fbbf24"/>
  <text x="300" y="110" fill="#8b5cf6" font-size="13" text-anchor="middle" font-weight="bold">Electron Transfer</text>
  
  <!-- After bonding -->
  <g id="Na-after">
    <circle cx="120" cy="320" r="15" fill="#ef4444"/>
    <text x="145" y="305" fill="#ef4444" font-size="24" font-weight="bold">+</text>
    <circle cx="120" cy="320" r="40" fill="none" stroke="#3b82f6" stroke-width="3"/>
    ${[0,1].map((i) => {
      const angle = (i * 360 / 2) * Math.PI / 180;
      const x = 120 + 40 * Math.cos(angle);
      const y = 320 + 40 * Math.sin(angle);
      return `<circle cx="${x}" cy="${y}" r="5" fill="#fbbf24"/>`;
    }).join('')}
    <circle cx="120" cy="320" r="60" fill="none" stroke="#10b981" stroke-width="3"/>
    ${[0,1,2,3,4,5,6,7].map((i) => {
      const angle = (i * 360 / 8) * Math.PI / 180;
      const x = 480 + 65 * Math.cos(angle);
      const y = 320 + 65 * Math.sin(angle);
      return `<circle cx="${x}" cy="${y}" r="5" fill="#fbbf24"/>`;
    }).join('')}
    <text x="480" y="395" fill="#10b981" font-size="14" text-anchor="middle" font-weight="bold">Cl⁻ (anion)</text>
    <text x="480" y="412" fill="#6b7280" font-size="10" text-anchor="middle">Stable: 2, 8, 8</text>
  </g>
  
  <!-- Attraction -->
  <line x1="180" y1="320" x2="420" y2="320" stroke="#f59e0b" stroke-width="3" stroke-dasharray="5,5"/>
  <text x="300" y="310" fill="#f59e0b" font-size="13" text-anchor="middle" font-weight="bold">Electrostatic Attraction</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Ionic Bond Formation</text>
  <text x="300" y="50" fill="#6b7280" font-size="12" text-anchor="middle">Electron transfer creates oppositely charged ions</text>
</svg>`,
        description: 'Sodium transfers electron to chlorine. Na⁺ and Cl⁻ ions form, attracting each other to create ionic bond in NaCl.'
      },
      {
        type: 'svg',
        title: 'Covalent Bonding - H₂O Water Molecule',
        content: `<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Oxygen atom center -->
  <circle cx="250" cy="200" r="35" fill="#ef4444" stroke="#dc2626" stroke-width="3"/>
  <text x="250" y="210" fill="white" font-size="20" text-anchor="middle" font-weight="bold">O</text>
  
  <!-- Hydrogen atoms -->
  <circle cx="150" cy="140" r="20" fill="#3b82f6" stroke="#2563eb" stroke-width="3"/>
  <text x="150" y="147" fill="white" font-size="16" text-anchor="middle" font-weight="bold">H</text>
  
  <circle cx="350" cy="140" r="20" fill="#3b82f6" stroke="#2563eb" stroke-width="3"/>
  <text x="350" y="147" fill="white" font-size="16" text-anchor="middle" font-weight="bold">H</text>
  
  <!-- Covalent bonds (shared electrons) -->
  <line x1="170" y1="150" x2="230" y2="190" stroke="#fbbf24" stroke-width="6"/>
  <circle cx="200" cy="170" r="6" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="200" cy="170" r="6" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" transform="translate(10, 0)"/>
  <text x="185" y="160" fill="#fbbf24" font-size="12" font-weight="bold">Shared pair</text>
  
  <line x1="330" y1="150" x2="270" y2="190" stroke="#fbbf24" stroke-width="6"/>
  <circle cx="300" cy="170" r="6" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="300" cy="170" r="6" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" transform="translate(10, 0)"/>
  <text x="315" y="160" fill="#fbbf24" font-size="12" font-weight="bold">Shared pair</text>
  
  <!-- Lone pairs on oxygen -->
  <circle cx="235" cy="240" r="5" fill="#10b981"/>
  <circle cx="250" cy="240" r="5" fill="#10b981"/>
  <circle cx="265" cy="240" r="5" fill="#10b981"/>
  <circle cx="250" cy="255" r="5" fill="#10b981"/>
  <text x="250" y="280" fill="#10b981" font-size="11" text-anchor="middle">2 lone pairs</text>
  
  <!-- Lewis structure -->
  <rect x="50" y="310" width="180" height="80" fill="#1f2937" rx="5"/>
  <text x="140" y="335" fill="white" font-size="14" text-anchor="middle" font-weight="bold">Lewis Structure:</text>
  <text x="140" y="360" fill="#3b82f6" font-size="16" text-anchor="middle">H - O - H</text>
  <text x="140" y="380" fill="#9ca3af" font-size="11" text-anchor="middle">with 2 dots above and below O</text>
  
  <!-- Bond angle -->
  <path d="M 170 140 Q 250 120 330 140" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="250" y="110" fill="#8b5cf6" font-size="13" text-anchor="middle" font-weight="bold">104.5°</text>
  
  <!-- Info box -->
  <rect x="270" y="310" width="210" height="80" fill="#f3f4f6" rx="5"/>
  <text x="375" y="330" fill="#1f2937" font-size="12" text-anchor="middle" font-weight="bold">Each H shares 1 electron</text>
  <text x="375" y="348" fill="#6b7280" font-size="11" text-anchor="middle">H gets 2 e⁻ (stable)</text>
  <text x="375" y="365" fill="#6b7280" font-size="11" text-anchor="middle">O gets 8 e⁻ (octet)</text>
  <text x="375" y="383" fill="#ef4444" font-size="11" text-anchor="middle" font-weight="bold">Polar molecule!</text>
  
  <!-- Title -->
  <text x="250" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Covalent Bonding in Water (H₂O)</text>
  <text x="250" y="50" fill="#6b7280" font-size="12" text-anchor="middle">Atoms share electrons to achieve stable configurations</text>
</svg>`,
        description: 'Water molecule shows covalent bonding. Oxygen shares electrons with two hydrogen atoms. Each bond is a shared electron pair.'
      },
      {
        type: 'svg',
        title: 'Types of Chemical Bonds Comparison',
        content: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Ionic -->
  <rect x="30" y="50" width="160" height="200" fill="#fee2e2" stroke="#ef4444" stroke-width="3" rx="8"/>
  <text x="110" y="80" fill="#ef4444" font-size="16" text-anchor="middle" font-weight="bold">IONIC BOND</text>
  <circle cx="70" cy="130" r="18" fill="#ef4444"/>
  <text x="85" y="118" fill="#ef4444" font-size="18" font-weight="bold">+</text>
  <circle cx="150" cy="130" r="18" fill="#3b82f6"/>
  <text x="135" y="118" fill="#3b82f6" font-size="18" font-weight="bold">−</text>
  <line x1="88" y1="130" x2="132" y2="130" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="110" y="170" fill="#1f2937" font-size="11" text-anchor="middle">Electron transfer</text>
  <text x="110" y="190" fill="#6b7280" font-size="10" text-anchor="middle">Metal + Nonmetal</text>
  <text x="110" y="205" fill="#6b7280" font-size="10" text-anchor="middle">Example: NaCl</text>
  <text x="110" y="230" fill="#ef4444" font-size="10" text-anchor="middle" font-weight="bold">High melting point</text>
  <text x="110" y="243" fill="#ef4444" font-size="10" text-anchor="middle" font-weight="bold">Conducts when liquid</text>
  
  <!-- Covalent -->
  <rect x="220" y="50" width="160" height="200" fill="#dbeafe" stroke="#3b82f6" stroke-width="3" rx="8"/>
  <text x="300" y="80" fill="#3b82f6" font-size="16" text-anchor="middle" font-weight="bold">COVALENT BOND</text>
  <circle cx="270" cy="130" r="18" fill="#10b981"/>
  <circle cx="330" cy="130" r="18" fill="#10b981"/>
  <circle cx="295" cy="130" r="6" fill="#fbbf24"/>
  <circle cx="305" cy="130" r="6" fill="#fbbf24"/>
  <text x="300" y="170" fill="#1f2937" font-size="11" text-anchor="middle">Electron sharing</text>
  <text x="300" y="190" fill="#6b7280" font-size="10" text-anchor="middle">Nonmetal + Nonmetal</text>
  <text x="300" y="205" fill="#6b7280" font-size="10" text-anchor="middle">Example: H₂O, CO₂</text>
  <text x="300" y="230" fill="#3b82f6" font-size="10" text-anchor="middle" font-weight="bold">Low melting point</text>
  <text x="300" y="243" fill="#3b82f6" font-size="10" text-anchor="middle" font-weight="bold">Doesn't conduct</text>
  
  <!-- Metallic -->
  <rect x="410" y="50" width="160" height="200" fill="#fef3c7" stroke="#fbbf24" stroke-width="3" rx="8"/>
  <text x="490" y="80" fill="#f59e0b" font-size="16" text-anchor="middle" font-weight="bold">METALLIC BOND</text>
  <circle cx="450" cy="120" r="12" fill="#6b7280"/>
  <text x="450" y="125" fill="white" font-size="10" text-anchor="middle" font-weight="bold">+</text>
  <circle cx="490" cy="120" r="12" fill="#6b7280"/>
  <text x="490" y="125" fill="white" font-size="10" text-anchor="middle" font-weight="bold">+</text>
  <circle cx="530" cy="120" r="12" fill="#6b7280"/>
  <text x="530" y="125" fill="white" font-size="10" text-anchor="middle" font-weight="bold">+</text>
  <circle cx="470" cy="150" r="12" fill="#6b7280"/>
  <text x="470" y="155" fill="white" font-size="10" text-anchor="middle" font-weight="bold">+</text>
  <circle cx="510" cy="150" r="12" fill="#6b7280"/>
  <text x="510" y="155" fill="white" font-size="10" text-anchor="middle" font-weight="bold">+</text>
  ${[0,1,2,3,4,5,6,7,8].map((i) => {
    const x = 430 + (i % 3) * 40 + Math.random() * 20;
    const y = 110 + Math.floor(i / 3) * 25 + Math.random() * 15;
    return `<circle cx="${x}" cy="${y}" r="3" fill="#fbbf24" opacity="0.8"/>`;
  }).join('')}
  <text x="490" y="180" fill="#1f2937" font-size="11" text-anchor="middle">"Sea of electrons"</text>
  <text x="490" y="200" fill="#6b7280" font-size="10" text-anchor="middle">Metal atoms</text>
  <text x="490" y="215" fill="#6b7280" font-size="10" text-anchor="middle">Example: Cu, Fe, Au</text>
  <text x="490" y="235" fill="#f59e0b" font-size="10" text-anchor="middle" font-weight="bold">Conducts electricity</text>
  <text x="490" y="248" fill="#f59e0b" font-size="10" text-anchor="middle" font-weight="bold">Malleable, ductile</text>
  
  <!-- Electronegativity scale -->
  <rect x="50" y="280" width="500" height="190" fill="#1f2937" rx="8"/>
  <text x="300" y="310" fill="white" font-size="18" text-anchor="middle" font-weight="bold">Bond Type by Electronegativity Difference</text>
  
  <!-- Scale -->
  <defs>
    <linearGradient id="bondGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="100" y="340" width="400" height="40" fill="url(#bondGradient)" rx="5"/>
  
  <!-- Labels -->
  <text x="300" y="330" fill="#9ca3af" font-size="12" text-anchor="middle">Electronegativity Difference (ΔEN)</text>
  <text x="110" y="395" fill="#3b82f6" font-size="13" text-anchor="middle" font-weight="bold">0</text>
  <text x="110" y="415" fill="#3b82f6" font-size="11" text-anchor="middle">Nonpolar</text>
  <text x="110" y="428" fill="#3b82f6" font-size="11" text-anchor="middle">Covalent</text>
  <text x="110" y="445" fill="#9ca3af" font-size="9" text-anchor="middle">H₂, O₂, Cl₂</text>
  
  <text x="250" y="395" fill="#8b5cf6" font-size="13" text-anchor="middle" font-weight="bold">0.4 - 1.7</text>
  <text x="250" y="415" fill="#8b5cf6" font-size="11" text-anchor="middle">Polar</text>
  <text x="250" y="428" fill="#8b5cf6" font-size="11" text-anchor="middle">Covalent</text>
  <text x="250" y="445" fill="#9ca3af" font-size="9" text-anchor="middle">H₂O, NH₃, HCl</text>
  
  <text x="490" y="395" fill="#ef4444" font-size="13" text-anchor="middle" font-weight="bold">> 1.7</text>
  <text x="490" y="415" fill="#ef4444" font-size="11" text-anchor="middle">Ionic</text>
  <text x="490" y="428" fill="#ef4444" font-size="11" text-anchor="middle">Bond</text>
  <text x="490" y="445" fill="#9ca3af" font-size="9" text-anchor="middle">NaCl, MgO, CaF₂</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="22" text-anchor="middle" font-weight="bold">Three Types of Chemical Bonds</text>
</svg>`,
        description: 'Comparison of ionic (electron transfer), covalent (electron sharing), and metallic (sea of electrons) bonds with their properties.'
      }
    ],

    examples: [
      {
        question: 'Predict the bond type between Magnesium (Mg) and Oxygen (O).',
        solution: 'Ionic bond',
        steps: [
          'Identify elements: Mg is metal, O is nonmetal',
          'Mg (Group 2): 2 valence electrons, wants to lose 2',
          'O (Group 16): 6 valence electrons, wants to gain 2',
          'Mg loses 2 e⁻ → Mg²⁺',
          'O gains 2 e⁻ → O²⁻',
          'Result: Ionic bond forms MgO'
        ]
      },
      {
        question: 'Draw Lewis structure for NH₃ (ammonia) and determine bond type.',
        solution: 'Covalent bonds; N has 1 lone pair',
        steps: [
          'Count valence electrons: N (5) + 3H (3×1) = 8 total',
          'N needs 3 more electrons for octet',
          'Each H needs 1 electron',
          'N shares with 3 H atoms: 3 single bonds',
          'Lewis structure: H-N-H with H above, 1 lone pair on N',
          'All covalent bonds (nonmetal + nonmetal)'
        ]
      },
      {
        question: 'Why does NaCl conduct electricity when dissolved but not as solid?',
        solution: 'Ions are mobile in solution, fixed in solid',
        steps: [
          'NaCl has ionic bonds: Na⁺ and Cl⁻ ions',
          'Solid: Ions locked in crystal lattice',
          'Cannot move → Cannot conduct electricity',
          'Dissolved: Water separates ions',
          'Ions free to move in solution',
          'Mobile charges conduct electricity!'
        ]
      }
    ],

    keyPoints: [
      'Ionic bonds: electron transfer, metal + nonmetal (NaCl)',
      'Covalent bonds: electron sharing, nonmetal + nonmetal (H₂O)',
      'Metallic bonds: sea of delocalized electrons in metals',
      'Atoms bond to achieve stable electron configurations (octet)',
      'Electronegativity difference determines bond type',
      'Polar covalent: unequal sharing creates partial charges',
      'Bond strength: Triple > Double > Single covalent bonds'
    ],

    applications: [
      'Materials Science: Design strong, lightweight materials',
      'Drug Design: Understanding molecular interactions',
      'Semiconductors: Covalent bonds in silicon enable electronics',
      'Biochemistry: Proteins held together by various bonds',
      'Polymers: Long chains of covalently bonded atoms (plastics)',
      'Metallurgy: Metal alloys use metallic bonding properties'
    ]
  },

  // ===== CHEMISTRY TOPIC 3: Chemical Reactions (FULL) =====
  {
    id: 'chemistry-reactions',
    title: 'Chemical Reactions & Equations',
    category: 'chemistry',
    difficulty: 'intermediate',
    icon: '⚗️',
    description: 'Learn to balance equations, classify reactions, and understand stoichiometry.',
    
    theory: `**Chemical Reactions** transform reactants into products by breaking and forming chemical bonds.

**What Happens in a Chemical Reaction:**
- Bonds in reactants break (requires energy)
- Atoms rearrange
- New bonds form in products (releases energy)
- Mass is conserved (Law of Conservation of Mass)
- Energy is either absorbed or released

**Chemical Equations:**
Written representation of a chemical reaction.

**Format:** Reactants → Products

**Example:** 2H₂ + O₂ → 2H₂O
- Coefficients (2, 1, 2) show relative amounts
- Subscripts (₂) show atoms per molecule
- Arrow means "reacts to form"

**Balancing Chemical Equations:**
Atoms must be conserved (same number on each side)!

**Steps:**
1. Write unbalanced equation with correct formulas
2. Count atoms of each element on both sides
3. Add coefficients to balance (NEVER change subscripts!)
4. Check that all atoms balance
5. Use smallest whole number coefficients

**Types of Chemical Reactions:**

**1. Synthesis (Combination):**
Two or more substances combine to form one product.
- A + B → AB
- Example: 2Na + Cl₂ → 2NaCl
- Example: N₂ + 3H₂ → 2NH₃

**2. Decomposition:**
One substance breaks down into two or more products.
- AB → A + B
- Example: 2H₂O → 2H₂ + O₂
- Example: CaCO₃ → CaO + CO₂

**3. Single Replacement:**
One element replaces another in a compound.
- A + BC → AC + B (if A more reactive than B)
- Example: Zn + 2HCl → ZnCl₂ + H₂
- Example: Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag

**4. Double Replacement:**
Two compounds exchange ions.
- AB + CD → AD + CB
- Example: NaCl + AgNO₃ → NaNO₃ + AgCl↓ (precipitate)
- Example: HCl + NaOH → NaCl + H₂O (neutralization)

**5. Combustion:**
Substance reacts with oxygen, releases energy (heat/light).
- Fuel + O₂ → CO₂ + H₂O + Energy
- Example: CH₄ + 2O₂ → CO₂ + 2H₂O (burning methane)
- Example: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O (propane)

**Signs a Chemical Reaction Occurred:**
- Color change
- Temperature change (hot or cold)
- Gas bubbles form
- Precipitate (solid) forms
- Light produced
- Odor change

**Stoichiometry:**
Quantitative relationships in chemical reactions.

**Mole Ratio:** Coefficients show mole ratios
- 2H₂ + O₂ → 2H₂O
- Means: 2 moles H₂ : 1 mole O₂ : 2 moles H₂O

**Using Stoichiometry:**
1. Balance equation
2. Convert given to moles
3. Use mole ratio to find unknown moles
4. Convert to desired units

**Energy in Reactions:**

**Exothermic:** Releases energy
- Products have less energy than reactants
- Feels hot
- Example: Combustion, hand warmers

**Endothermic:** Absorbs energy
- Products have more energy than reactants
- Feels cold
- Example: Photosynthesis, cold packs

**Law of Conservation of Mass:**
Mass is neither created nor destroyed in chemical reactions.
- Total mass of reactants = Total mass of products
- Atoms rearrange but aren't lost or created`,

    formulas: [
      'Moles = Mass / Molar Mass',
      'Number of particles = Moles × 6.02 × 10²³ (Avogadro\'s number)',
      'Mass of product = (Moles of reactant) × (Mole ratio) × (Molar mass of product)',
      'Percent Yield = (Actual Yield / Theoretical Yield) × 100%',
      'Limiting Reactant: Reactant that runs out first',
      'Molar Mass: Sum of atomic masses in compound (g/mol)',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Balancing Chemical Equations',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Balancing: H₂ + O₂ → H₂O</text>
  
  <!-- Unbalanced -->
  <rect x="50" y="60" width="500" height="100" fill="#fee2e2" stroke="#ef4444" stroke-width="3" rx="8"/>
  <text x="300" y="85" fill="#ef4444" font-size="16" text-anchor="middle" font-weight="bold">UNBALANCED ✗</text>
  <text x="300" y="115" fill="#1f2937" font-size="18" text-anchor="middle" font-family="monospace">H₂ + O₂ → H₂O</text>
  <text x="120" y="145" fill="#6b7280" font-size="12">Reactants: 2 H, 2 O</text>
  <text x="420" y="145" fill="#6b7280" font-size="12">Products: 2 H, 1 O</text>
  <text x="300" y="145" fill="#ef4444" font-size="14" text-anchor="middle" font-weight="bold">O not balanced!</text>
  
  <!-- Arrow down -->
  <defs>
    <marker id="arrowDown" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto">
      <polygon points="0 0, 10 0, 5 10" fill="#8b5cf6"/>
    </marker>
  </defs>
  <line x1="300" y1="170" x2="300" y2="200" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrowDown)"/>
  <text x="320" y="190" fill="#8b5cf6" font-size="13" font-weight="bold">Balance!</text>
  
  <!-- Balanced -->
  <rect x="50" y="210" width="500" height="120" fill="#d1fae5" stroke="#10b981" stroke-width="3" rx="8"/>
  <text x="300" y="235" fill="#10b981" font-size="16" text-anchor="middle" font-weight="bold">BALANCED ✓</text>
  <text x="300" y="270" fill="#1f2937" font-size="22" text-anchor="middle" font-family="monospace" font-weight="bold">2H₂ + O₂ → 2H₂O</text>
  <text x="130" y="305" fill="#6b7280" font-size="12">Reactants: 4 H, 2 O</text>
  <text x="430" y="305" fill="#6b7280" font-size="12">Products: 4 H, 2 O</text>
  <text x="300" y="305" fill="#10b981" font-size="14" text-anchor="middle" font-weight="bold">All balanced!</text>
  
  <!-- Visual representation -->
  <text x="300" y="360" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Visual:</text>
  
  <!-- Molecules -->
  <g id="H2-1">
    <circle cx="100" cy="380" r="8" fill="#3b82f6"/>
    <circle cx="115" cy="380" r="8" fill="#3b82f6"/>
  </g>
  <g id="H2-2">
    <circle cx="140" cy="380" r="8" fill="#3b82f6"/>
    <circle cx="155" cy="380" r="8" fill="#3b82f6"/>
  </g>
  <text x="127" y="372" fill="#3b82f6" font-size="11" font-weight="bold">2H₂</text>
  
  <text x="180" y="385" fill="#6b7280" font-size="16">+</text>
  
  <g id="O2">
    <circle cx="210" cy="380" r="8" fill="#ef4444"/>
    <circle cx="225" cy="380" r="8" fill="#ef4444"/>
  </g>
  <text x="217" y="372" fill="#ef4444" font-size="11" font-weight="bold">O₂</text>
  
  <text x="250" y="385" fill="#6b7280" font-size="16">→</text>
  
  <g id="H2O-1">
    <circle cx="295" cy="380" r="8" fill="#ef4444"/>
    <circle cx="283" cy="390" r="6" fill="#3b82f6"/>
    <circle cx="307" cy="390" r="6" fill="#3b82f6"/>
  </g>
  <g id="H2O-2">
    <circle cx="345" cy="380" r="8" fill="#ef4444"/>
    <circle cx="333" cy="390" r="6" fill="#3b82f6"/>
    <circle cx="357" cy="390" r="6" fill="#3b82f6"/>
  </g>
  <text x="320" y="372" fill="#10b981" font-size="11" font-weight="bold">2H₂O</text>
</svg>`,
        description: 'Balancing equations ensures atoms are conserved. Add coefficients (not subscripts) to balance both sides.'
      },
      {
        type: 'svg',
        title: 'Types of Chemical Reactions',
        content: `<svg viewBox="0 0 600 550" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="25" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Five Main Types of Reactions</text>
  
  <!-- 1. Synthesis -->
  <rect x="30" y="50" width="260" height="90" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="5"/>
  <text x="160" y="72" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">1. SYNTHESIS (Combination)</text>
  <text x="160" y="95" fill="#1f2937" font-size="13" text-anchor="middle" font-family="monospace">A + B → AB</text>
  <text x="160" y="115" fill="#6b7280" font-size="11" text-anchor="middle">Example: 2H₂ + O₂ → 2H₂O</text>
  <text x="160" y="132" fill="#6b7280" font-size="10" text-anchor="middle" font-style="italic">Two or more → One product</text>
  
  <!-- 2. Decomposition -->
  <rect x="310" y="50" width="260" height="90" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="5"/>
  <text x="440" y="72" fill="#f59e0b" font-size="14" text-anchor="middle" font-weight="bold">2. DECOMPOSITION</text>
  <text x="440" y="95" fill="#1f2937" font-size="13" text-anchor="middle" font-family="monospace">AB → A + B</text>
  <text x="440" y="115" fill="#6b7280" font-size="11" text-anchor="middle">Example: 2H₂O → 2H₂ + O₂</text>
  <text x="440" y="132" fill="#6b7280" font-size="10" text-anchor="middle" font-style="italic">One → Two or more products</text>
  
  <!-- 3. Single Replacement -->
  <rect x="30" y="160" width="260" height="90" fill="#e9d5ff" stroke="#8b5cf6" stroke-width="2" rx="5"/>
  <text x="160" y="182" fill="#8b5cf6" font-size="14" text-anchor="middle" font-weight="bold">3. SINGLE REPLACEMENT</text>
  <text x="160" y="205" fill="#1f2937" font-size="13" text-anchor="middle" font-family="monospace">A + BC → AC + B</text>
  <text x="160" y="225" fill="#6b7280" font-size="11" text-anchor="middle">Example: Zn + 2HCl → ZnCl₂ + H₂</text>
  <text x="160" y="242" fill="#6b7280" font-size="10" text-anchor="middle" font-style="italic">One element replaces another</text>
  
  <!-- 4. Double Replacement -->
  <rect x="310" y="160" width="260" height="90" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="5"/>
  <text x="440" y="182" fill="#ec4899" font-size="14" text-anchor="middle" font-weight="bold">4. DOUBLE REPLACEMENT</text>
  <text x="440" y="205" fill="#1f2937" font-size="13" text-anchor="middle" font-family="monospace">AB + CD → AD + CB</text>
  <text x="440" y="225" fill="#6b7280" font-size="11" text-anchor="middle">Example: NaCl + AgNO₃ → NaNO₃ + AgCl</text>
  <text x="440" y="242" fill="#6b7280" font-size="10" text-anchor="middle" font-style="italic">Two compounds swap partners</text>
  
  <!-- 5. Combustion -->
  <rect x="170" y="270" width="260" height="90" fill="#fee2e2" stroke="#ef4444" stroke-width="2" rx="5"/>
  <text x="300" y="292" fill="#ef4444" font-size="14" text-anchor="middle" font-weight="bold">5. COMBUSTION</text>
  <text x="300" y="315" fill="#1f2937" font-size="13" text-anchor="middle" font-family="monospace">Fuel + O₂ → CO₂ + H₂O</text>
  <text x="300" y="335" fill="#6b7280" font-size="11" text-anchor="middle">Example: CH₄ + 2O₂ → CO₂ + 2H₂O</text>
  <text x="300" y="352" fill="#6b7280" font-size="10" text-anchor="middle" font-style="italic">Burns with oxygen, releases energy</text>
  
  <!-- Signs of reaction -->
  <rect x="50" y="380" width="500" height="150" fill="#1f2937" rx="8"/>
  <text x="300" y="405" fill="white" font-size="16" text-anchor="middle" font-weight="bold">Signs a Chemical Reaction Occurred:</text>
  
  <g id="signs">
    <circle cx="100" cy="435" r="5" fill="#fbbf24"/>
    <text x="115" y="440" fill="#9ca3af" font-size="12">Color change</text>
    
    <circle cx="100" cy="460" r="5" fill="#fbbf24"/>
    <text x="115" y="465" fill="#9ca3af" font-size="12">Gas bubbles form</text>
    
    <circle cx="100" cy="485" r="5" fill="#fbbf24"/>
    <text x="115" y="490" fill="#9ca3af" font-size="12">Light produced</text>
    
    <circle cx="350" cy="435" r="5" fill="#fbbf24"/>
    <text x="365" y="440" fill="#9ca3af" font-size="12">Temperature change</text>
    
    <circle cx="350" cy="460" r="5" fill="#fbbf24"/>
    <text x="365" y="465" fill="#9ca3af" font-size="12">Precipitate forms</text>
    
    <circle cx="350" cy="485" r="5" fill="#fbbf24"/>
    <text x="365" y="490" fill="#9ca3af" font-size="12">Odor change</text>
  </g>
  
  <text x="300" y="515" fill="#10b981" font-size="11" text-anchor="middle" font-weight="bold">Remember: Mass is always conserved!</text>
</svg>`,
        description: 'Five main types of chemical reactions with examples and general forms. Each type has characteristic patterns.'
      },
      {
        type: 'svg',
        title: 'Stoichiometry: Mole Ratios',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Stoichiometry Example</text>
  
  <!-- Equation -->
  <rect x="100" y="50" width="400" height="60" fill="#1f2937" rx="8"/>
  <text x="300" y="85" fill="#fbbf24" font-size="22" text-anchor="middle" font-family="monospace" font-weight="bold">2H₂ + O₂ → 2H₂O</text>
  
  <!-- Mole ratios -->
  <rect x="50" y="130" width="500" height="80" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" rx="5"/>
  <text x="300" y="155" fill="#3b82f6" font-size="15" text-anchor="middle" font-weight="bold">Mole Ratios from Coefficients:</text>
  <text x="300" y="180" fill="#1f2937" font-size="13" text-anchor="middle">2 moles H₂ : 1 mole O₂ : 2 moles H₂O</text>
  <text x="300" y="200" fill="#6b7280" font-size="11" text-anchor="middle" font-style="italic">These ratios allow us to calculate amounts!</text>
  
  <!-- Example problem -->
  <rect x="50" y="230" width="220" height="150" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" rx="5"/>
  <text x="160" y="255" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">Problem:</text>
  <text x="160" y="275" fill="#6b7280" font-size="11" text-anchor="middle">How many moles of H₂O</text>
  <text x="160" y="290" fill="#6b7280" font-size="11" text-anchor="middle">are produced from</text>
  <text x="160" y="305" fill="#ef4444" font-size="13" text-anchor="middle" font-weight="bold">5 moles of H₂?</text>
  <text x="160" y="330" fill="#6b7280" font-size="10" text-anchor="middle">Given: 5 mol H₂</text>
  <text x="160" y="345" fill="#6b7280" font-size="10" text-anchor="middle">Find: mol H₂O</text>
  <text x="160" y="365" fill="#8b5cf6" font-size="10" text-anchor="middle" font-style="italic">Mole ratio: 2 H₂ : 2 H₂O</text>
  
  <!-- Arrow -->
  <defs>
    <marker id="arrowCalc" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#10b981"/>
    </marker>
  </defs>
  <line x1="280" y1="305" x2="320" y2="305" stroke="#10b981" stroke-width="3" marker-end="url(#arrowCalc)"/>
  
  <!-- Solution -->
  <rect x="330" y="230" width="220" height="150" fill="#d1fae5" stroke="#10b981" stroke-width="2" rx="5"/>
  <text x="440" y="255" fill="#10b981" font-size="14" text-anchor="middle" font-weight="bold">Solution:</text>
  <text x="440" y="280" fill="#1f2937" font-size="11" text-anchor="middle">5 mol H₂ × (2 mol H₂O / 2 mol H₂)</text>
  <text x="440" y="300" fill="#1f2937" font-size="11" text-anchor="middle">= 5 mol H₂O</text>
  <text x="440" y="330" fill="#10b981" font-size="14" text-anchor="middle" font-weight="bold">Answer: 5 moles H₂O</text>
  <text x="440" y="355" fill="#6b7280" font-size="10" text-anchor="middle">The 1:1 ratio means</text>
  <text x="440" y="370" fill="#6b7280" font-size="10" text-anchor="middle">same moles produced!</text>
</svg>`,
        description: 'Stoichiometry uses balanced equation coefficients as mole ratios to calculate amounts of reactants and products.'
      }
    ],

    examples: [
      {
        question: 'Balance the equation: Fe + O₂ → Fe₂O₃',
        solution: '4Fe + 3O₂ → 2Fe₂O₃',
        steps: [
          'Count atoms: Left (1 Fe, 2 O), Right (2 Fe, 3 O)',
          'Balance Fe: Need 4 Fe on left → 4Fe + O₂',
          'Now have 4 Fe on left, need 2 Fe₂O₃ on right',
          '4Fe + O₂ → 2Fe₂O₃',
          'Balance O: Right has 6 O, need 3 O₂ on left',
          'Final: 4Fe + 3O₂ → 2Fe₂O₃ ✓'
        ]
      },
      {
        question: 'How many moles of O₂ are needed to react with 10 moles of C in: C + O₂ → CO₂',
        solution: '10 moles O₂',
        steps: [
          'First balance: C + O₂ → CO₂ (already balanced)',
          'Mole ratio: 1 C : 1 O₂ : 1 CO₂',
          'Given: 10 moles C',
          'Ratio 1:1 means need same moles of O₂',
          'Need 10 moles O₂',
          'This produces 10 moles CO₂'
        ]
      },
      {
        question: 'Identify the reaction type: 2KClO₃ → 2KCl + 3O₂',
        solution: 'Decomposition',
        steps: [
          'One reactant: KClO₃',
          'Two products: KCl and O₂',
          'Pattern: AB → A + B',
          'One substance breaks into two or more',
          'This is decomposition',
          'Common when heating compounds'
        ]
      }
    ],

    keyPoints: [
      'Balance equations: same atoms on both sides (coefficients, not subscripts)',
      'Five main types: synthesis, decomposition, single/double replacement, combustion',
      'Coefficients in balanced equations show mole ratios',
      'Mass is conserved in all chemical reactions',
      'Stoichiometry uses mole ratios to calculate amounts',
      'Exothermic reactions release energy, endothermic absorb energy',
      'Evidence of reaction: color/temp change, gas, precipitate, light'
    ],

    applications: [
      'Industrial Chemistry: Scale up reactions from lab to factory',
      'Environmental: Understand combustion, pollution reactions',
      'Medicine: Drug synthesis requires precise stoichiometry',
      'Agriculture: Fertilizer production (Haber process for ammonia)',
      'Food Industry: Baking uses chemical reactions (CO₂ from baking soda)',
      'Explosives: Combustion reactions produce gases rapidly'
    ]
  },

  // ===== CHEMISTRY TOPIC 4: Acids, Bases & pH (FULL) =====
  {
    id: 'chemistry-acids-bases',
    title: 'Acids, Bases & pH',
    category: 'chemistry',
    difficulty: 'intermediate',
    icon: '🧪',
    description: 'Understand acids, bases, pH scale, neutralization, and buffer solutions.',
    
    theory: `**Acids and Bases** are two important classes of compounds with opposite properties.

**ACIDS:**

**Properties:**
- Taste sour (NEVER taste in lab!)
- Turn blue litmus paper red
- pH less than 7
- React with metals to produce H₂ gas
- Conduct electricity in water

**Definition (Arrhenius):**
Acids produce H⁺ ions (protons) in water.
- HCl → H⁺ + Cl⁻
- H₂SO₄ → 2H⁺ + SO₄²⁻

**Common Acids:**
- Hydrochloric acid (HCl): Stomach acid, strong
- Sulfuric acid (H₂SO₄): Car batteries, strong
- Acetic acid (CH₃COOH): Vinegar, weak
- Citric acid: Citrus fruits, weak
- Carbonic acid (H₂CO₃): Carbonated drinks

**Strong vs Weak Acids:**
- **Strong:** Completely dissociates (100%)
  - HCl, H₂SO₄, HNO₃
- **Weak:** Partially dissociates (<5%)
  - CH₃COOH, H₂CO₃, H₃PO₄

**BASES:**

**Properties:**
- Taste bitter (NEVER taste in lab!)
- Feel slippery
- Turn red litmus paper blue
- pH greater than 7
- Conduct electricity in water

**Definition (Arrhenius):**
Bases produce OH⁻ ions (hydroxide) in water.
- NaOH → Na⁺ + OH⁻
- Ca(OH)₂ → Ca²⁺ + 2OH⁻

**Common Bases:**
- Sodium hydroxide (NaOH): Drain cleaner, strong
- Calcium hydroxide (Ca(OH)₂): Lime, strong
- Ammonia (NH₃): Cleaning products, weak
- Baking soda (NaHCO₃): Baking, weak

**Strong vs Weak Bases:**
- **Strong:** Completely dissociates
  - NaOH, KOH, Ca(OH)₂
- **Weak:** Partially dissociates
  - NH₃, NaHCO₃

**THE pH SCALE:**

**pH = -log[H⁺]**

Scale from 0 to 14 measuring acidity/basicity:
- **pH < 7:** Acidic (more H⁺)
- **pH = 7:** Neutral (pure water)
- **pH > 7:** Basic/Alkaline (more OH⁻)

**Each pH unit = 10× difference in [H⁺]!**
- pH 3 is 10× more acidic than pH 4
- pH 3 is 100× more acidic than pH 5

**Common pH Values:**
- Battery acid (H₂SO₄): pH 0-1
- Lemon juice: pH 2
- Vinegar: pH 3
- Coffee: pH 5
- Pure water: pH 7
- Baking soda: pH 9
- Ammonia: pH 11
- Drain cleaner: pH 14

**NEUTRALIZATION:**

Acid + Base → Salt + Water

**Example:** HCl + NaOH → NaCl + H₂O
- H⁺ from acid + OH⁻ from base → H₂O
- This is an exothermic reaction (releases heat)

**Applications:**
- Antacids neutralize stomach acid
- Treating acid spills with base
- Agriculture: Adjusting soil pH

**BUFFERS:**

Solutions that resist pH changes when acid/base added.

**How Buffers Work:**
- Contain weak acid and its conjugate base
- Example: CH₃COOH/CH₃COO⁻
- If H⁺ added: Base neutralizes it
- If OH⁻ added: Acid neutralizes it

**Importance:**
- Blood pH buffer: Keeps pH at 7.4 (critical!)
- Small pH change in blood can be deadly
- Lakes/rivers need buffers for aquatic life

**INDICATORS:**

Substances that change color with pH:
- **Litmus:** Red in acid, blue in base
- **Phenolphthalein:** Colorless in acid, pink in base
- **Universal indicator:** Rainbow of colors for different pH
- **pH paper:** Quick pH measurement

**Bronsted-Lowry Definition:**
- **Acid:** Proton (H⁺) donor
- **Base:** Proton (H⁺) acceptor
- More general than Arrhenius definition`,

    formulas: [
      'pH = -log[H⁺] --- pH from hydrogen ion concentration',
      '[H⁺] = 10⁻ᵖᴴ --- Hydrogen ion concentration from pH',
      'pH + pOH = 14 --- At 25°C',
      'pOH = -log[OH⁻] --- pOH from hydroxide concentration',
      '[H⁺][OH⁻] = 1.0 × 10⁻¹⁴ --- Ion product of water (Kw)',
      'Acid + Base → Salt + Water --- Neutralization',
      'Molarity (M) = moles / liters --- Concentration',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'pH Scale with Common Substances',
        content: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <!-- pH scale gradient -->
  <defs>
    <linearGradient id="phGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
      <stop offset="35%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="65%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main scale bar -->
  <rect x="50" y="150" width="600" height="60" fill="url(#phGradient)" stroke="#1f2937" stroke-width="3" rx="5"/>
  
  <!-- pH numbers -->
  ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((ph) => {
    const x = 50 + (ph * 600 / 14);
    return `
      <line x1="${x}" y1="150" x2="${x}" y2="210" stroke="white" stroke-width="1"/>
      <text x="${x}" y="230" fill="#1f2937" font-size="14" text-anchor="middle" font-weight="bold">${ph}</text>
    `;
  }).join('')}
  
  <!-- Labels -->
  <text x="150" y="130" fill="#dc2626" font-size="16" text-anchor="middle" font-weight="bold">ACIDIC</text>
  <text x="350" y="130" fill="#10b981" font-size="16" text-anchor="middle" font-weight="bold">NEUTRAL</text>
  <text x="550" y="130" fill="#8b5cf6" font-size="16" text-anchor="middle" font-weight="bold">BASIC</text>
  
  <!-- Examples above scale -->
  <text x="93" y="100" fill="#dc2626" font-size="10" text-anchor="middle">Battery</text>
  <text x="93" y="112" fill="#dc2626" font-size="10" text-anchor="middle">acid</text>
  
  <text x="136" y="100" fill="#ef4444" font-size="10" text-anchor="middle">Lemon</text>
  <text x="136" y="112" fill="#ef4444" font-size="10" text-anchor="middle">juice</text>
  
  <text x="179" y="100" fill="#f59e0b" font-size="10" text-anchor="middle">Vinegar</text>
  
  <text x="264" y="100" fill="#fbbf24" font-size="10" text-anchor="middle">Coffee</text>
  
  <text x="350" y="100" fill="#10b981" font-size="10" text-anchor="middle" font-weight="bold">Pure</text>
  <text x="350" y="112" fill="#10b981" font-size="10" text-anchor="middle" font-weight="bold">Water</text>
  
  <text x="478" y="100" fill="#3b82f6" font-size="10" text-anchor="middle">Baking</text>
  <text x="478" y="112" fill="#3b82f6" font-size="10" text-anchor="middle">soda</text>
  
  <text x="564" y="100" fill="#8b5cf6" font-size="10" text-anchor="middle">Ammonia</text>
  
  <text x="607" y="100" fill="#a855f7" font-size="10" text-anchor="middle">Drain</text>
  <text x="607" y="112" fill="#a855f7" font-size="10" text-anchor="middle">cleaner</text>
  
  <!-- Info below -->
  <text x="200" y="270" fill="#ef4444" font-size="13" text-anchor="middle" font-weight="bold">More H⁺ ions</text>
  <text x="200" y="285" fill="#6b7280" font-size="11" text-anchor="middle">Stronger acids</text>
  
  <text x="500" y="270" fill="#8b5cf6" font-size="13" text-anchor="middle" font-weight="bold">More OH⁻ ions</text>
  <text x="500" y="285" fill="#6b7280" font-size="11" text-anchor="middle">Stronger bases</text>
  
  <!-- Key fact -->
  <rect x="150" y="310" width="400" height="70" fill="#1f2937" rx="8"/>
  <text x="350" y="335" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">Each pH unit = 10× difference in acidity!</text>
  <text x="350" y="355" fill="#9ca3af" font-size="11" text-anchor="middle">pH 3 is 100× more acidic than pH 5</text>
  <text x="350" y="372" fill="#9ca3af" font-size="11" text-anchor="middle">pH 10 is 1000× more basic than pH 7</text>
  
  <!-- Title -->
  <text x="350" y="30" fill="#1f2937" font-size="22" text-anchor="middle" font-weight="bold">The pH Scale</text>
  <text x="350" y="52" fill="#6b7280" font-size="13" text-anchor="middle">Measures acidity and basicity (0-14)</text>
</svg>`,
        description: 'pH scale from 0-14: acids (0-7), neutral (7), bases (7-14). Each unit is 10× change in H⁺ concentration.'
      },
      {
        type: 'svg',
        title: 'Neutralization Reaction',
        content: `<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <!-- Acid -->
  <circle cx="120" cy="100" r="40" fill="#ef4444" stroke="#dc2626" stroke-width="3"/>
  <text x="120" y="95" fill="white" font-size="16" text-anchor="middle" font-weight="bold">HCl</text>
  <text x="120" y="112" fill="white" font-size="12" text-anchor="middle">Acid</text>
  <text x="120" y="160" fill="#ef4444" font-size="13" text-anchor="middle" font-weight="bold">H⁺ + Cl⁻</text>
  
  <!-- Plus sign -->
  <text x="200" y="110" fill="#1f2937" font-size="28" font-weight="bold">+</text>
  
  <!-- Base -->
  <circle cx="280" cy="100" r="40" fill="#8b5cf6" stroke="#7c3aed" stroke-width="3"/>
  <text x="280" y="95" fill="white" font-size="16" text-anchor="middle" font-weight="bold">NaOH</text>
  <text x="280" y="112" fill="white" font-size="12" text-anchor="middle">Base</text>
  <text x="280" y="160" fill="#8b5cf6" font-size="13" text-anchor="middle" font-weight="bold">Na⁺ + OH⁻</text>
  
  <!-- Arrow down -->
  <defs>
    <marker id="arrowReact" markerWidth="12" markerHeight="12" refX="6" refY="11" orient="auto">
      <polygon points="0 0, 12 0, 6 12" fill="#10b981"/>
    </marker>
  </defs>
  <line x1="200" y1="180" x2="200" y2="220" stroke="#10b981" stroke-width="4" marker-end="url(#arrowReact)"/>
  <text x="230" y="205" fill="#10b981" font-size="14" font-weight="bold">React!</text>
  
  <!-- Products -->
  <rect x="50" y="235" width="300" height="100" fill="#d1fae5" stroke="#10b981" stroke-width="3" rx="8"/>
  <text x="200" y="260" fill="#10b981" font-size="16" text-anchor="middle" font-weight="bold">PRODUCTS:</text>
  
  <!-- Salt -->
  <circle cx="120" cy="295" r="25" fill="#3b82f6"/>
  <text x="120" y="300" fill="white" font-size="14" text-anchor="middle" font-weight="bold">NaCl</text>
  <text x="120" y="325" fill="#1f2937" font-size="11" text-anchor="middle" font-weight="bold">Salt</text>
  
  <text x="200" y="300" fill="#1f2937" font-size="20" font-weight="bold">+</text>
  
  <!-- Water -->
  <circle cx="280" cy="295" r="25" fill="#06b6d4"/>
  <text x="280" y="300" fill="white" font-size="14" text-anchor="middle" font-weight="bold">H₂O</text>
  <text x="280" y="325" fill="#1f2937" font-size="11" text-anchor="middle" font-weight="bold">Water</text>
  
  <!-- Equation -->
  <rect x="380" y="50" width="200" height="120" fill="#1f2937" rx="8"/>
  <text x="480" y="75" fill="#fbbf24" font-size="14" text-anchor="middle" font-weight="bold">General Form:</text>
  <text x="480" y="105" fill="white" font-size="13" text-anchor="middle" font-family="monospace">Acid + Base →</text>
  <text x="480" y="130" fill="white" font-size="13" text-anchor="middle" font-family="monospace">Salt + Water</text>
  <text x="480" y="160" fill="#10b981" font-size="11" text-anchor="middle">Neutralization</text>
  
  <!-- Info -->
  <rect x="380" y="190" width="200" height="145" fill="#f3f4f6" rx="8"/>
  <text x="480" y="215" fill="#1f2937" font-size="12" text-anchor="middle" font-weight="bold">Key Points:</text>
  <text x="480" y="235" fill="#6b7280" font-size="10" text-anchor="middle">• H⁺ + OH⁻ → H₂O</text>
  <text x="480" y="250" fill="#6b7280" font-size="10" text-anchor="middle">• Exothermic (releases heat)</text>
  <text x="480" y="265" fill="#6b7280" font-size="10" text-anchor="middle">• pH moves toward 7</text>
  <text x="480" y="280" fill="#6b7280" font-size="10" text-anchor="middle">• Used in antacids</text>
  <text x="480" y="295" fill="#6b7280" font-size="10" text-anchor="middle">• Treats acid spills</text>
  <text x="480" y="315" fill="#ef4444" font-size="10" text-anchor="middle" font-weight="bold">Example: Stomach acid</text>
  <text x="480" y="328" fill="#ef4444" font-size="10" text-anchor="middle" font-weight="bold">neutralized by antacid</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="22" text-anchor="middle" font-weight="bold">Neutralization Reaction</text>
</svg>`,
        description: 'Acid and base react to form salt and water. H⁺ and OH⁻ ions combine to make H₂O, neutralizing each other.'
      }
    ],

    examples: [
      {
        question: 'What is the pH of a solution with [H⁺] = 1 × 10⁻⁴ M?',
        solution: 'pH = 4 (acidic)',
        steps: [
          'Use formula: pH = -log[H⁺]',
          'Substitute: pH = -log(1 × 10⁻⁴)',
          'pH = -log(10⁻⁴)',
          'pH = -(-4)',
          'pH = 4',
          'Since pH < 7, solution is acidic'
        ]
      },
      {
        question: 'Complete and balance: H₂SO₄ + KOH → ?',
        solution: 'H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O',
        steps: [
          'This is acid + base = salt + water',
          'Products: K₂SO₄ (salt) + H₂O',
          'Unbalanced: H₂SO₄ + KOH → K₂SO₄ + H₂O',
          'Need 2 K on left, so 2KOH',
          'Count H: Left (2+2=4), need 2 H₂O',
          'Balanced: H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O'
        ]
      },
      {
        question: 'Explain why blood pH must stay at 7.4.',
        solution: 'Enzymes only work at specific pH; deviation is dangerous',
        steps: [
          'Blood pH normal: 7.35-7.45 (slightly basic)',
          'Enzymes have optimal pH for function',
          'pH too low (acidosis): Enzymes don\'t work properly',
          'pH too high (alkalosis): Also disrupts enzymes',
          'Buffer systems maintain pH (H₂CO₃/HCO₃⁻)',
          'pH < 6.8 or > 7.8 can be fatal!'
        ]
      }
    ],

    keyPoints: [
      'Acids: produce H⁺ in water, pH < 7, taste sour',
      'Bases: produce OH⁻ in water, pH > 7, taste bitter, feel slippery',
      'pH scale: 0-14, each unit is 10× change in [H⁺]',
      'Neutralization: Acid + Base → Salt + Water',
      'Strong acids/bases: completely dissociate',
      'Weak acids/bases: partially dissociate',
      'Buffers: resist pH changes, critical in blood and biology'
    ],

    applications: [
      'Medicine: Antacids neutralize stomach acid, pH of blood critical',
      'Agriculture: Soil pH affects plant growth, lime raises pH',
      'Swimming Pools: Maintain pH 7.2-7.8 for safety and comfort',
      'Food Industry: Preservation (pickles use acetic acid)',
      'Environmental: Acid rain (from SO₂, NO₂) harms ecosystems',
      'Cleaning: Bases dissolve grease, acids remove mineral deposits'
    ]
  },

  // ===== CHEMISTRY TOPIC 5: Organic Chemistry Basics (THEORY ONLY) =====
  {
    id: 'chemistry-organic',
    title: 'Introduction to Organic Chemistry',
    category: 'chemistry',
    difficulty: 'advanced',
    icon: '🧬',
    description: 'Explore the chemistry of carbon compounds, hydrocarbons, and functional groups.',
    
    theory: `**Organic Chemistry** is the study of carbon-containing compounds. Carbon is unique and forms the basis of all life!

**Why Carbon is Special:**

**1. Four Valence Electrons:**
- Can form 4 covalent bonds
- Creates stable, complex molecules
- Bonds with many elements (H, O, N, S, etc.)

**2. Catenation:**
- Carbon atoms bond to other carbon atoms
- Forms long chains, branches, rings
- Allows millions of different compounds

**3. Multiple Bonding:**
- Single bonds (C-C)
- Double bonds (C=C)
- Triple bonds (C≡C)

**HYDROCARBONS:**

Compounds containing only carbon and hydrogen.

**Types of Hydrocarbons:**

**1. Alkanes (Saturated):**
- Only single bonds
- General formula: CₙH₂ₙ₊₂
- Examples: CH₄ (methane), C₂H₆ (ethane), C₃H₈ (propane)
- Naming ends in "-ane"
- Relatively unreactive

**2. Alkenes (Unsaturated):**
- Contains C=C double bond
- General formula: CₙH₂ₙ
- Examples: C₂H₄ (ethene), C₃H₆ (propene)
- Naming ends in "-ene"
- More reactive than alkanes

**3. Alkynes (Unsaturated):**
- Contains C≡C triple bond
- General formula: CₙH₂ₙ₋₂
- Examples: C₂H₂ (ethyne/acetylene)
- Naming ends in "-yne"
- Very reactive

**4. Aromatic (Benzene rings):**
- Ring structure with delocalized electrons
- C₆H₆ (benzene)
- Very stable, distinctive properties

**STRUCTURAL ISOMERS:**

Same molecular formula, different structure!

**Example:** C₄H₁₀ has two isomers:
- n-butane: straight chain
- isobutane: branched chain

Different structures = different properties!

**FUNCTIONAL GROUPS:**

Specific atom groups that determine chemical properties:

**1. Alcohols (-OH):**
- Example: Ethanol (CH₃CH₂OH)
- Found in alcoholic beverages
- Polar, dissolves in water
- Naming ends in "-ol"

**2. Carboxylic Acids (-COOH):**
- Example: Acetic acid (CH₃COOH)
- Vinegar
- Donates H⁺ (acidic)
- Naming ends in "-oic acid"

**3. Aldehydes (-CHO):**
- Example: Formaldehyde (HCHO)
- Carbonyl at end of chain
- Naming ends in "-al"

**4. Ketones (C=O):**
- Example: Acetone (CH₃COCH₃)
- Carbonyl in middle of chain
- Nail polish remover
- Naming ends in "-one"

**5. Esters (-COO-):**
- Example: Ethyl acetate
- Sweet smell, found in fruits
- Made from alcohol + acid
- Naming: [alcohol name] [acid name]

**6. Amines (-NH₂):**
- Example: Methylamine (CH₃NH₂)
- Contains nitrogen
- Basic properties
- Found in proteins (amino acids)

**NAMING ORGANIC COMPOUNDS:**

**IUPAC System:**
1. Find longest carbon chain (base name)
2. Number carbons (give substituents lowest numbers)
3. Name substituents (methyl, ethyl, etc.)
4. Add prefixes for multiple groups (di-, tri-, tetra-)
5. Alphabetize substituents

**POLYMERS:**

Large molecules made of repeating units (monomers).

**Examples:**
- **Polyethylene:** Made from ethene (plastic bags)
- **Polypropylene:** Made from propene (bottles)
- **Polyvinyl chloride (PVC):** Pipes, flooring
- **Nylon:** Synthetic fiber
- **Natural polymers:** DNA, proteins, cellulose, starch

**Addition Polymers:**
- Monomers with C=C double bonds
- Double bond opens, links form chain
- Example: Ethene → Polyethylene

**Condensation Polymers:**
- Monomers join, releasing small molecule (H₂O)
- Example: Amino acids → Proteins

**IMPORTANCE OF ORGANIC CHEMISTRY:**

**Biochemistry:**
- Proteins, DNA, carbohydrates, lipids all organic
- All life processes involve organic reactions

**Pharmaceuticals:**
- Most drugs are organic compounds
- Understanding structure helps design new medicines

**Materials:**
- Plastics, synthetic fibers, rubber
- Petroleum products: gasoline, kerosene

**Energy:**
- Fossil fuels are organic (coal, oil, natural gas)
- Biofuels from organic matter

**Agriculture:**
- Pesticides, herbicides, fertilizers
- Understanding plant biochemistry

**REACTIONS IN ORGANIC CHEMISTRY:**

**1. Combustion:**
- Hydrocarbon + O₂ → CO₂ + H₂O + Energy
- Powers engines, heating

**2. Addition:**
- Adds atoms across C=C or C≡C
- Alkenes become alkanes

**3. Substitution:**
- One atom/group replaces another
- Common in alkanes

**4. Polymerization:**
- Monomers join to form polymers
- Creates plastics, fibers

**Why Study Organic Chemistry?**
- Foundation of biochemistry and medicine
- Creates new materials and drugs
- Understanding life at molecular level
- Environmental chemistry (pollutants, biofuels)
- Food chemistry (nutrition, preservation)

Organic chemistry is everywhere - in your body, your clothes, your food, and the environment!`
  },

  // ===== CHEMISTRY TOPIC 6: Electrochemistry (THEORY ONLY) =====
  {
    id: 'chemistry-electrochemistry',
    title: 'Electrochemistry & Batteries',
    category: 'chemistry',
    difficulty: 'intermediate',
    icon: '🔋',
    description: 'Explore the relationship between electricity and chemical reactions - the science behind batteries and corrosion.',
    
    theory: `**Electrochemistry** is the study of chemical reactions that produce electricity and electricity that drives chemical reactions. It powers our portable world!

**Oxidation and Reduction (REDOX):**

**Oxidation:** Loss of electrons (OIL - Oxidation Is Loss)
- Element's oxidation number increases
- Example: Zn → Zn²⁺ + 2e⁻

**Reduction:** Gain of electrons (RIG - Reduction Is Gain)
- Element's oxidation number decreases
- Example: Cu²⁺ + 2e⁻ → Cu

**Redox reactions always occur together!** Electrons lost by one species are gained by another.

**Oxidizing Agent:** Gets reduced (accepts electrons)
**Reducing Agent:** Gets oxidized (donates electrons)

**ELECTROCHEMICAL CELLS:**

Two main types: Galvanic (Voltaic) and Electrolytic

**1. GALVANIC/VOLTAIC CELLS:**
- **Spontaneous** reactions produce electricity
- Chemical energy → Electrical energy
- Examples: Batteries, fuel cells

**Key Components:**
- **Anode:** Oxidation occurs (negative terminal)
- **Cathode:** Reduction occurs (positive terminal)
- **Salt Bridge:** Maintains electrical neutrality
- **External Circuit:** Electrons flow through wire

**How Batteries Work:**
1. Oxidation at anode releases electrons
2. Electrons flow through external circuit (your device!)
3. Electrons received at cathode cause reduction
4. Salt bridge completes internal circuit

**Cell Notation:**
Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)
- | represents phase boundary
- || represents salt bridge
- Anode on left, cathode on right

**Standard Cell Potential (E°cell):**
Measures voltage produced by cell under standard conditions
- E°cell = E°cathode - E°anode
- Positive E°cell → Spontaneous reaction → Works as battery!

**2. ELECTROLYTIC CELLS:**
- **Non-spontaneous** reactions driven by external electricity
- Electrical energy → Chemical energy
- Requires external power source

**Applications:**
- **Electroplating:** Coating objects with metal (chrome bumpers, jewelry)
- **Metal Refining:** Purifying copper, aluminum production
- **Electrolysis of Water:** 2H₂O → 2H₂ + O₂ (produces hydrogen fuel)
- **Chlor-alkali Process:** Salt water → Chlorine + Sodium hydroxide

**TYPES OF BATTERIES:**

**Primary Batteries (Non-rechargeable):**
- **Alkaline:** Common household batteries (AA, AAA, 9V)
- **Zinc-Carbon:** Older, cheaper batteries
- **Lithium:** Long-lasting, used in watches, cameras
- Use once, then dispose

**Secondary Batteries (Rechargeable):**
- **Lead-Acid:** Car batteries, heavy but reliable
- **Nickel-Cadmium (NiCd):** Older rechargeable tech
- **Nickel-Metal Hydride (NiMH):** Better than NiCd
- **Lithium-Ion:** Phones, laptops, electric cars
  - High energy density
  - Lightweight
  - No memory effect
  - Can be recharged hundreds of times

**FUEL CELLS:**
- Continuous electricity generation
- Hydrogen + Oxygen → Water + Electricity
- Very efficient, only byproduct is water!
- Used in: Space shuttles, some cars, backup power

**CORROSION:**
Unwanted electrochemical process destroying metals.

**Rusting of Iron:**
- Anode: Fe → Fe²⁺ + 2e⁻ (iron oxidized)
- Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O (oxygen reduced)
- Forms Fe₂O₃·nH₂O (rust)

**Factors Affecting Corrosion:**
- Presence of water and oxygen
- Salt (increases conductivity)
- Acids (lower pH)
- Contact with more active metal

**Preventing Corrosion:**
1. **Painting/Coating:** Barrier from air/water
2. **Galvanizing:** Coating with zinc (sacrificial metal)
3. **Alloying:** Stainless steel (iron + chromium)
4. **Cathodic Protection:** Attach more active metal
5. **Electroplating:** Coat with non-reactive metal

**FARADAY'S LAWS OF ELECTROLYSIS:**

**First Law:** Mass deposited is proportional to charge passed
m ∝ Q (Q = current × time)

**Second Law:** Mass deposited is proportional to equivalent weight
Different metals deposit at different rates for same charge

**APPLICATIONS OF ELECTROCHEMISTRY:**

**Energy Storage:**
- All portable electronics depend on batteries
- Electric vehicles revolutionizing transportation
- Grid-scale energy storage for renewable energy

**Industry:**
- Aluminum production (electrolysis of Al₂O₃)
- Chlorine and sodium hydroxide production
- Metal purification and recycling

**Medicine:**
- Pacemaker batteries
- Electrochemical sensors (glucose monitors)
- Nerve signals are electrochemical!

**Environmental:**
- Water purification and desalination
- Electrochemical sensors for pollution monitoring
- Green hydrogen production from water

**Future Technologies:**
- Solid-state batteries (safer, higher capacity)
- Sodium-ion batteries (cheaper than lithium)
- Flow batteries for long-duration energy storage
- Metal-air batteries (ultra-high energy density)

**Why Electrochemistry Matters:**
From the smartphone in your pocket to electric cars and renewable energy storage, electrochemistry enables our modern portable world. Understanding electron transfer reactions helps us design better batteries, prevent corrosion, and create sustainable energy solutions!`
  }
];

// ==================== BIOLOGY (6 Topics) ====================

export const biologyTopics: ModuleTopic[] = [
  // ===== BIOLOGY TOPIC 1: Cell Structure & Function (FULL) =====
  {
    id: 'biology-cell-structure',
    title: 'Cell Structure & Function',
    category: 'biology',
    difficulty: 'beginner',
    icon: '🔬',
    description: 'Discover the building blocks of life - cell organelles, their functions, and how cells work.',
    
    theory: `**The Cell** is the basic structural and functional unit of all living organisms. All life forms are made of one or more cells.

**Cell Theory:**
1. All living organisms are composed of one or more cells
2. The cell is the basic unit of life
3. All cells arise from pre-existing cells

**Two Main Cell Types:**

**Prokaryotic Cells** (Bacteria & Archaea):
- No membrane-bound nucleus
- DNA in nucleoid region
- No membrane-bound organelles
- Generally smaller (1-10 μm)
- Simple structure
- Example: E. coli bacteria

**Eukaryotic Cells** (Animals, Plants, Fungi, Protists):
- Membrane-bound nucleus containing DNA
- Complex membrane-bound organelles
- Larger (10-100 μm)
- More complex organization
- Example: Human cells, plant cells

**Key Cell Organelles and Functions:**

**Nucleus:**
- "Control center" of the cell
- Contains DNA (genetic information)
- Nuclear envelope separates nucleus from cytoplasm
- Nucleolus produces ribosomes

**Mitochondria:**
- "Powerhouse of the cell"
- Cellular respiration: Converts glucose + oxygen → ATP (energy)
- Has its own DNA (inherited from mother)
- More mitochondria in energy-demanding cells (muscle, brain)

**Ribosomes:**
- Protein synthesis factories
- Read mRNA and assemble amino acids into proteins
- Found free in cytoplasm or attached to ER
- Not membrane-bound

**Endoplasmic Reticulum (ER):**
- Network of membranes
- **Rough ER:** Has ribosomes, makes proteins
- **Smooth ER:** No ribosomes, makes lipids, detoxifies

**Golgi Apparatus:**
- "Post office" of the cell
- Modifies, packages, and sorts proteins
- Prepares molecules for transport

**Lysosomes (Animal cells):**
- "Recycling centers"
- Contains digestive enzymes
- Breaks down waste, old organelles, pathogens

**Cell Membrane:**
- Phospholipid bilayer with embedded proteins
- Selectively permeable: Controls what enters/exits
- Maintains cell shape and integrity

**Plant-Specific Structures:**
- **Cell Wall:** Rigid structure outside membrane (cellulose)
- **Chloroplasts:** Photosynthesis (light → glucose)
- **Large Central Vacuole:** Storage, maintains turgor pressure

**Why Cells Matter:**
Understanding cells helps us:
- Treat diseases (cancer = uncontrolled cell division)
- Develop antibiotics (target bacterial cells)
- Engineer crops (modify plant cells)
- Create medicines (use cell processes)
- Understand inheritance (DNA in nucleus)`,

    formulas: [
      'Cellular Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
      'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
      'Surface Area to Volume Ratio = Surface Area / Volume',
      'Cell Volume = 4/3 πr³ (spherical cell)',
      'Cell Surface Area = 4πr² (spherical cell)',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Animal Cell Structure',
        content: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Cell membrane (outer boundary) -->
  <ellipse cx="300" cy="250" rx="250" ry="200" fill="#fef3c7" stroke="#f59e0b" stroke-width="4"/>
  
  <!-- Nucleus (large circle in center) -->
  <circle cx="300" cy="250" r="70" fill="#ddd6fe" stroke="#7c3aed" stroke-width="3"/>
  <text x="300" y="250" fill="#5b21b6" font-size="16" text-anchor="middle" font-weight="bold">Nucleus</text>
  <text x="300" y="268" fill="#5b21b6" font-size="11" text-anchor="middle">(DNA/Control)</text>
  <!-- Nucleolus -->
  <circle cx="280" cy="235" r="15" fill="#a78bfa" stroke="#6d28d9" stroke-width="2"/>
  
  <!-- Mitochondria (bean-shaped) -->
  <ellipse cx="420" cy="180" rx="35" ry="20" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <path d="M 390 180 Q 405 175 420 180 Q 435 185 450 180" stroke="#dc2626" stroke-width="1" fill="none"/>
  <text x="420" y="220" fill="#dc2626" font-size="12" text-anchor="middle" font-weight="bold">Mitochondrion</text>
  <text x="420" y="235" fill="#dc2626" font-size="10" text-anchor="middle">(Powerhouse)</text>
  
  <!-- Another mitochondrion -->
  <ellipse cx="180" cy="330" rx="35" ry="20" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <path d="M 150 330 Q 165 325 180 330 Q 195 335 210 330" stroke="#dc2626" stroke-width="1" fill="none"/>
  
  <!-- Ribosomes (small dots) -->
  <circle cx="240" cy="160" r="4" fill="#374151"/>
  <circle cx="260" cy="165" r="4" fill="#374151"/>
  <circle cx="350" cy="290" r="4" fill="#374151"/>
  <circle cx="370" cy="295" r="4" fill="#374151"/>
  <text x="305" y="175" fill="#374151" font-size="10" font-weight="bold">Ribosomes</text>
  
  <!-- Rough ER (wavy lines with ribosomes) -->
  <path d="M 150 200 Q 170 195 190 200 Q 210 205 230 200" stroke="#3b82f6" stroke-width="3" fill="none"/>
  <path d="M 150 215 Q 170 210 190 215 Q 210 220 230 215" stroke="#3b82f6" stroke-width="3" fill="none"/>
  <circle cx="160" cy="200" r="3" fill="#374151"/>
  <circle cx="180" cy="198" r="3" fill="#374151"/>
  <circle cx="200" cy="202" r="3" fill="#374151"/>
  <text x="190" y="245" fill="#3b82f6" font-size="11" font-weight="bold">Rough ER</text>
  
  <!-- Smooth ER -->
  <path d="M 380 320 Q 400 315 420 320 Q 440 325 460 320" stroke="#60a5fa" stroke-width="3" fill="none"/>
  <path d="M 380 335 Q 400 330 420 335 Q 440 340 460 335" stroke="#60a5fa" stroke-width="3" fill="none"/>
  <text x="420" y="360" fill="#60a5fa" font-size="11" font-weight="bold">Smooth ER</text>
  
  <!-- Golgi Apparatus (stacked membranes) -->
  <g id="golgi">
    <path d="M 450 240 Q 470 235 490 240" stroke="#10b981" stroke-width="3" fill="none"/>
    <path d="M 450 250 Q 470 245 490 250" stroke="#10b981" stroke-width="3" fill="none"/>
    <path d="M 450 260 Q 470 255 490 260" stroke="#10b981" stroke-width="3" fill="none"/>
    <path d="M 450 270 Q 470 265 490 270" stroke="#10b981" stroke-width="3" fill="none"/>
  </g>
  <text x="520" y="255" fill="#10b981" font-size="11" font-weight="bold">Golgi</text>
  <text x="520" y="268" fill="#10b981" font-size="9">Apparatus</text>
  
  <!-- Lysosomes (circles with enzymes) -->
  <circle cx="150" cy="280" r="18" fill="#f0abfc" stroke="#c026d3" stroke-width="2"/>
  <text x="150" y="285" fill="#a21caf" font-size="10" text-anchor="middle" font-weight="bold">L</text>
  <text x="120" y="310" fill="#c026d3" font-size="10" font-weight="bold">Lysosome</text>
  
  <!-- Cell Membrane label -->
  <text x="300" y="470" fill="#f59e0b" font-size="14" text-anchor="middle" font-weight="bold">Cell Membrane</text>
  <text x="300" y="485" fill="#f59e0b" font-size="10" text-anchor="middle">(Controls entry/exit)</text>
  
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Animal Cell</text>
  <text x="300" y="50" fill="#6b7280" font-size="12" text-anchor="middle">Eukaryotic cell with membrane-bound organelles</text>
</svg>`,
        description: 'Animal cell showing major organelles: nucleus (control), mitochondria (energy), ribosomes (protein synthesis), ER, Golgi, and lysosomes.'
      },
      {
        type: 'svg',
        title: 'Plant Cell vs Animal Cell',
        content: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Plant Cell (Left) -->
  <rect x="50" y="80" width="280" height="280" fill="#dcfce7" stroke="#22c55e" stroke-width="4" rx="5"/>
  <text x="190" y="110" fill="#16a34a" font-size="16" text-anchor="middle" font-weight="bold">PLANT CELL</text>
  
  <!-- Cell Wall (outer layer) -->
  <rect x="40" y="70" width="300" height="300" fill="none" stroke="#15803d" stroke-width="6" rx="5"/>
  <text x="70" y="90" fill="#15803d" font-size="11" font-weight="bold">Cell Wall</text>
  
  <!-- Chloroplasts (green ovals) -->
  <ellipse cx="120" cy="180" rx="25" ry="15" fill="#4ade80" stroke="#22c55e" stroke-width="2"/>
  <ellipse cx="250" cy="200" rx="25" ry="15" fill="#4ade80" stroke="#22c55e" stroke-width="2"/>
  <text x="120" y="220" fill="#16a34a" font-size="10" text-anchor="middle" font-weight="bold">Chloroplast</text>
  
  <!-- Large Central Vacuole -->
  <ellipse cx="190" cy="240" rx="80" ry="60" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <text x="190" y="240" fill="#1e40af" font-size="12" text-anchor="middle" font-weight="bold">Central</text>
  <text x="190" y="255" fill="#1e40af" font-size="12" text-anchor="middle" font-weight="bold">Vacuole</text>
  
  <!-- Nucleus -->
  <circle cx="190" cy="160" r="30" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="190" y="165" fill="#5b21b6" font-size="11" text-anchor="middle" font-weight="bold">Nucleus</text>
  
  <!-- Mitochondrion -->
  <ellipse cx="270" cy="280" rx="20" ry="12" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  
  <!-- Animal Cell (Right) -->
  <ellipse cx="520" cy="220" rx="130" ry="140" fill="#fef3c7" stroke="#f59e0b" stroke-width="4"/>
  <text x="520" y="110" fill="#ea580c" font-size="16" text-anchor="middle" font-weight="bold">ANIMAL CELL</text>
  
  <!-- Nucleus -->
  <circle cx="520" cy="220" r="35" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="520" y="225" fill="#5b21b6" font-size="11" text-anchor="middle" font-weight="bold">Nucleus</text>
  
  <!-- Mitochondria -->
  <ellipse cx="450" cy="180" rx="20" ry="12" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <ellipse cx="580" cy="260" rx="20" ry="12" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <text x="520" cy="320" fill="#dc2626" font-size="10" text-anchor="middle">Mitochondria</text>
  
  <!-- Small vacuoles -->
  <circle cx="470" cy="260" r="12" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1"/>
  <circle cx="560" cy="200" r="10" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1"/>
  <text x="515" y="295" fill="#3b82f6" font-size="9" text-anchor="middle">Small vacuoles</text>
  
  <!-- Lysosomes -->
  <circle cx="490" cy="290" r="8" fill="#f0abfc" stroke="#c026d3" stroke-width="1"/>
  <circle cx="550" cy="240" r="8" fill="#f0abfc" stroke="#c026d3" stroke-width="1"/>
  
  <!-- Comparison Table -->
  <rect x="150" y="375" width="400" height="20" fill="#1f2937" rx="3"/>
  <text x="350" y="390" fill="white" font-size="12" text-anchor="middle" font-weight="bold">Key Differences</text>
  
  <!-- Legend -->
  <text x="100" y="30" fill="#22c55e" font-size="11" font-weight="bold">✓ Cell Wall (rigid)</text>
  <text x="100" y="45" fill="#22c55e" font-size="11" font-weight="bold">✓ Chloroplasts</text>
  <text x="100" y="60" fill="#22c55e" font-size="11" font-weight="bold">✓ Large Vacuole</text>
  
  <text x="500" y="30" fill="#f59e0b" font-size="11" font-weight="bold">✓ No Cell Wall</text>
  <text x="500" y="45" fill="#f59e0b" font-size="11" font-weight="bold">✓ Lysosomes</text>
  <text x="500" y="60" fill="#f59e0b" font-size="11" font-weight="bold">✓ Small Vacuoles</text>
</svg>`,
        description: 'Plant cells have cell walls, chloroplasts, and large vacuoles. Animal cells have lysosomes and small vacuoles. Both have nucleus and mitochondria.'
      },
      {
        type: 'svg',
        title: 'Prokaryotic vs Eukaryotic Cells',
        content: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Prokaryotic Cell (Bacteria) -->
  <ellipse cx="150" cy="200" rx="100" ry="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="3"/>
  <text x="150" y="120" fill="#ea580c" font-size="16" text-anchor="middle" font-weight="bold">PROKARYOTIC</text>
  <text x="150" y="138" fill="#6b7280" font-size="11" text-anchor="middle">(Bacteria)</text>
  
  <!-- Cell wall -->
  <ellipse cx="150" cy="200" rx="110" ry="90" fill="none" stroke="#92400e" stroke-width="4"/>
  
  <!-- Nucleoid (DNA region - no membrane) -->
  <path d="M 130 190 Q 140 180 150 190 Q 160 200 170 190 Q 160 180 150 185 Q 140 180 130 190" 
        fill="#c084fc" stroke="#7c3aed" stroke-width="2"/>
  <text x="150" y="175" fill="#6d28d9" font-size="10" text-anchor="middle" font-weight="bold">DNA</text>
  <text x="150" y="230" fill="#6d28d9" font-size="9" text-anchor="middle">(Nucleoid)</text>
  
  <!-- Ribosomes (small dots) -->
  <circle cx="120" cy="220" r="3" fill="#374151"/>
  <circle cx="140" cy="225" r="3" fill="#374151"/>
  <circle cx="160" cy="215" r="3" fill="#374151"/>
  <circle cx="180" cy="220" r="3" fill="#374151"/>
  <circle cx="130" cy="180" r="3" fill="#374151"/>
  <circle cx="170" cy="185" r="3" fill="#374151"/>
  
  <!-- Flagellum -->
  <path d="M 250 200 Q 290 190 330 200 Q 370 210 410 200" stroke="#059669" stroke-width="3" fill="none"/>
  <text x="330" y="225" fill="#059669" font-size="9" font-weight="bold">Flagellum</text>
  
  <!-- Labels -->
  <text x="150" y="305" fill="#1f2937" font-size="10" text-anchor="middle">✗ No nucleus</text>
  <text x="150" y="320" fill="#1f2937" font-size="10" text-anchor="middle">✗ No organelles</text>
  <text x="150" y="335" fill="#1f2937" font-size="10" text-anchor="middle">✓ Simple & small</text>
  <text x="150" y="350" fill="#1f2937" font-size="10" text-anchor="middle">Size: 1-10 μm</text>
  
  <!-- Eukaryotic Cell -->
  <ellipse cx="450" cy="200" rx="110" ry="90" fill="#dcfce7" stroke="#22c55e" stroke-width="3"/>
  <text x="450" y="120" fill="#16a34a" font-size="16" text-anchor="middle" font-weight="bold">EUKARYOTIC</text>
  <text x="450" y="138" fill="#6b7280" font-size="11" text-anchor="middle">(Animals, Plants, Fungi)</text>
  
  <!-- Nucleus with membrane -->
  <circle cx="450" cy="200" r="35" fill="#ddd6fe" stroke="#7c3aed" stroke-width="3"/>
  <text x="450" y="200" fill="#5b21b6" font-size="11" text-anchor="middle" font-weight="bold">Nucleus</text>
  <text x="450" y="213" fill="#5b21b6" font-size="9" text-anchor="middle">(DNA)</text>
  
  <!-- Mitochondrion -->
  <ellipse cx="510" cy="240" rx="20" ry="12" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
  <path d="M 495 240 Q 502 237 510 240 Q 518 243 525 240" stroke="#dc2626" stroke-width="1" fill="none"/>
  <text x="535" y="245" fill="#dc2626" font-size="8">Mito</text>
  
  <!-- ER -->
  <path d="M 390 180 Q 400 178 410 180" stroke="#3b82f6" stroke-width="2" fill="none"/>
  <path d="M 390 190 Q 400 188 410 190" stroke="#3b82f6" stroke-width="2" fill="none"/>
  <text x="400" y="210" fill="#3b82f6" font-size="8">ER</text>
  
  <!-- Golgi -->
  <path d="M 490 170 Q 500 168 510 170" stroke="#10b981" stroke-width="2" fill="none"/>
  <path d="M 490 178 Q 500 176 510 178" stroke="#10b981" stroke-width="2" fill="none"/>
  <text x="520" y="175" fill="#10b981" font-size="8">Golgi</text>
  
  <!-- Ribosomes -->
  <circle cx="420" cy="220" r="3" fill="#374151"/>
  <circle cx="470" cy="230" r="3" fill="#374151"/>
  
  <!-- Labels -->
  <text x="450" y="305" fill="#1f2937" font-size="10" text-anchor="middle">✓ Membrane-bound nucleus</text>
  <text x="450" y="320" fill="#1f2937" font-size="10" text-anchor="middle">✓ Many organelles</text>
  <text x="450" y="335" fill="#1f2937" font-size="10" text-anchor="middle">✓ Complex & larger</text>
  <text x="450" y="350" fill="#1f2937" font-size="10" text-anchor="middle">Size: 10-100 μm</text>
  
  <!-- Title -->
  <text x="300" y="25" fill="#1f2937" font-size="18" text-anchor="middle" font-weight="bold">Two Main Cell Types</text>
  <text x="300" y="45" fill="#6b7280" font-size="12" text-anchor="middle">Prokaryotes are simpler; Eukaryotes are more complex</text>
  
  <!-- Dividing line -->
  <line x1="300" y1="80" x2="300" y2="370" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5,5"/>
</svg>`,
        description: 'Prokaryotes (bacteria) lack nucleus and organelles. Eukaryotes have membrane-bound nucleus and complex organelles.'
      }
    ],

    examples: [
      {
        question: 'Why do muscle cells have more mitochondria than skin cells?',
        solution: 'Muscle cells need more energy for contraction',
        steps: [
          'Mitochondria produce ATP (cellular energy)',
          'Muscle cells constantly contract and relax',
          'Contraction requires large amounts of ATP',
          'More mitochondria → More ATP production',
          'Skin cells have lower energy demands',
          'Therefore, muscle cells have many more mitochondria'
        ]
      },
      {
        question: 'A spherical cell doubles its radius. How does surface area to volume ratio change?',
        solution: 'SA:V ratio decreases (becomes less efficient)',
        steps: [
          'Original: r = 1, SA = 4π(1)² = 4π, V = 4/3π(1)³ = 4π/3',
          'Original SA:V = 4π ÷ 4π/3 = 3',
          'Doubled: r = 2, SA = 4π(2)² = 16π, V = 4/3π(2)³ = 32π/3',
          'New SA:V = 16π ÷ 32π/3 = 1.5',
          'SA:V decreased from 3 to 1.5',
          'Larger cells have harder time exchanging materials!'
        ]
      },
      {
        question: 'How do antibiotics like penicillin kill bacteria but not human cells?',
        solution: 'Target bacterial cell walls (humans lack cell walls)',
        steps: [
          'Bacteria have rigid cell walls (peptidoglycan)',
          'Human cells have only cell membranes (no walls)',
          'Penicillin inhibits cell wall synthesis',
          'Bacteria cannot maintain structure without walls',
          'Bacteria burst due to osmotic pressure',
          'Human cells unaffected (no cell walls to target)'
        ]
      }
    ],

    keyPoints: [
      'Cell is the basic unit of life (Cell Theory)',
      'Prokaryotes: No nucleus or organelles (bacteria)',
      'Eukaryotes: Nucleus and membrane-bound organelles',
      'Nucleus contains DNA and controls cell activities',
      'Mitochondria produce ATP through cellular respiration',
      'Ribosomes synthesize proteins from genetic instructions',
      'Plant cells have cell walls, chloroplasts, large vacuoles'
    ],

    applications: [
      'Medicine: Understanding cells helps treat diseases like cancer',
      'Antibiotics: Target bacterial cell structures without harming human cells',
      'Stem Cell Research: Using cells to regenerate damaged tissues',
      'Agriculture: Modifying plant cells to improve crop yields',
      'Biotechnology: Engineering cells to produce medicines (insulin)',
      'Disease Diagnosis: Analyzing cell structure to detect abnormalities'
    ]
  },

  // ===== BIOLOGY TOPIC 2: DNA & Genetics (FULL) =====
  {
    id: 'biology-dna-genetics',
    title: 'DNA, Genes & Heredity',
    category: 'biology',
    difficulty: 'intermediate',
    icon: '🧬',
    description: 'Unravel the secrets of heredity, DNA structure, and how traits are passed from parents to offspring.',
    
    theory: `**DNA (Deoxyribonucleic Acid)** is the molecule that stores genetic information in all living organisms.

**DNA Structure:**

**Double Helix:** Two complementary strands twisted together (discovered by Watson & Crick, 1953)

**Components:**
- **Sugar:** Deoxyribose (5-carbon sugar)
- **Phosphate group:** Links sugars together (backbone)
- **Nitrogenous bases:** Four types carry genetic code

**The Four Bases (and Base Pairing Rules):**
1. **Adenine (A)** pairs with **Thymine (T)** (2 hydrogen bonds)
2. **Guanine (G)** pairs with **Cytosine (C)** (3 hydrogen bonds)

**Why This Matters:** Base pairing allows DNA to:
- Replicate accurately
- Store information reliably
- Repair damage

**Genes:**
A gene is a segment of DNA that codes for a specific protein (or RNA).
- Humans have ~20,000-25,000 genes
- Genes determine traits (eye color, height, blood type)
- Located on chromosomes in nucleus

**Chromosomes:**
- DNA wrapped around histone proteins
- Humans: 46 chromosomes (23 pairs)
- 23 from mother, 23 from father
- Sex chromosomes: XX (female) or XY (male)

**Central Dogma of Molecular Biology:**
**DNA → RNA → Protein**

**1. Transcription (DNA → RNA):**
- DNA strand used as template
- RNA polymerase builds mRNA (messenger RNA)
- Occurs in nucleus

**2. Translation (RNA → Protein):**
- mRNA travels to ribosome in cytoplasm
- tRNA (transfer RNA) brings amino acids
- Ribosome reads codons (3-base sequences)
- Amino acids linked into protein chain

**Genetic Code:**
- 64 possible codons (4³ combinations)
- 61 code for 20 amino acids (redundant code)
- 3 are stop codons (UAA, UAG, UGA)
- 1 start codon (AUG = methionine)

**Heredity (Mendelian Genetics):**

**Gregor Mendel's Laws:**
1. **Law of Segregation:** Each parent contributes one allele per gene
2. **Law of Independent Assortment:** Genes for different traits inherited independently

**Key Terms:**
- **Allele:** Different version of a gene (e.g., brown vs blue eyes)
- **Dominant:** Expressed when present (represented by capital letter, B)
- **Recessive:** Only expressed when two copies present (bb)
- **Genotype:** Genetic makeup (BB, Bb, bb)
- **Phenotype:** Observable trait (brown eyes, blue eyes)
- **Homozygous:** Same alleles (BB or bb)
- **Heterozygous:** Different alleles (Bb)

**Punnett Squares:**
Tool to predict offspring genotypes and phenotypes from parent crosses.

**Mutations:**
Changes in DNA sequence
- Can be beneficial, harmful, or neutral
- Source of genetic variation
- Drive evolution`,

    formulas: [
      'Base Pairing: A—T (2 H-bonds), G≡C (3 H-bonds)',
      'DNA → RNA → Protein (Central Dogma)',
      'Codon: 3 nucleotide bases code for 1 amino acid',
      'Genetic Code: 4³ = 64 possible codons',
      'Mendelian Ratio (Monohybrid): 3:1 (dominant:recessive phenotype)',
      'Mendelian Ratio (Genotype): 1:2:1 (AA:Aa:aa)',
      'Probability: P(AB) = P(A) × P(B) for independent events',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'DNA Double Helix Structure',
        content: `<svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
  <!-- DNA backbone (sugar-phosphate) -->
  <!-- Left strand -->
  <path d="M 150 50 Q 120 150 150 250 Q 180 350 150 450 Q 120 550 150 580" 
        stroke="#3b82f6" stroke-width="8" fill="none"/>
  <!-- Right strand -->
  <path d="M 350 50 Q 380 150 350 250 Q 320 350 350 450 Q 380 550 350 580" 
        stroke="#3b82f6" stroke-width="8" fill="none"/>
  
  <!-- Base pairs -->
  <!-- A-T pair -->
  <line x1="150" y1="100" x2="350" y2="100" stroke="#ef4444" stroke-width="4"/>
  <circle cx="150" cy="100" r="12" fill="#fca5a5" stroke="#ef4444" stroke-width="2"/>
  <text x="150" y="105" fill="#7f1d1d" font-size="14" text-anchor="middle" font-weight="bold">A</text>
  <circle cx="350" cy="100" r="12" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
  <text x="350" y="105" fill="#78350f" font-size="14" text-anchor="middle" font-weight="bold">T</text>
  
  <!-- G-C pair -->
  <line x1="150" y1="180" x2="350" y2="180" stroke="#10b981" stroke-width="4"/>
  <circle cx="150" cy="180" r="12" fill="#86efac" stroke="#10b981" stroke-width="2"/>
  <text x="150" y="185" fill="#14532d" font-size="14" text-anchor="middle" font-weight="bold">G</text>
  <circle cx="350" cy="180" r="12" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <text x="350" y="185" fill="#1e3a8a" font-size="14" text-anchor="middle" font-weight="bold">C</text>
  
  <!-- T-A pair -->
  <line x1="150" y1="260" x2="350" y2="260" stroke="#ef4444" stroke-width="4"/>
  <circle cx="150" cy="260" r="12" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
  <text x="150" y="265" fill="#78350f" font-size="14" text-anchor="middle" font-weight="bold">T</text>
  <circle cx="350" cy="260" r="12" fill="#fca5a5" stroke="#ef4444" stroke-width="2"/>
  <text x="350" y="265" fill="#7f1d1d" font-size="14" text-anchor="middle" font-weight="bold">A</text>
  
  <!-- C-G pair -->
  <line x1="150" y1="340" x2="350" y2="340" stroke="#10b981" stroke-width="4"/>
  <circle cx="150" cy="340" r="12" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <text x="150" y="345" fill="#1e3a8a" font-size="14" text-anchor="middle" font-weight="bold">C</text>
  <circle cx="350" cy="340" r="12" fill="#86efac" stroke="#10b981" stroke-width="2"/>
  <text x="350" y="345" fill="#14532d" font-size="14" text-anchor="middle" font-weight="bold">G</text>
  
  <!-- A-T pair -->
  <line x1="150" y1="420" x2="350" y2="420" stroke="#ef4444" stroke-width="4"/>
  <circle cx="150" cy="420" r="12" fill="#fca5a5" stroke="#ef4444" stroke-width="2"/>
  <text x="150" y="425" fill="#7f1d1d" font-size="14" text-anchor="middle" font-weight="bold">A</text>
  <circle cx="350" cy="420" r="12" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
  <text x="350" y="425" fill="#78350f" font-size="14" text-anchor="middle" font-weight="bold">T</text>
  
  <!-- G-C pair -->
  <line x1="150" y1="500" x2="350" y2="500" stroke="#10b981" stroke-width="4"/>
  <circle cx="150" cy="500" r="12" fill="#86efac" stroke="#10b981" stroke-width="2"/>
  <text x="150" y="505" fill="#14532d" font-size="14" text-anchor="middle" font-weight="bold">G</text>
  <circle cx="350" cy="500" r="12" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <text x="350" y="505" fill="#1e3a8a" font-size="14" text-anchor="middle" font-weight="bold">C</text>
  
  <!-- Labels -->
  <text x="70" y="200" fill="#3b82f6" font-size="12" font-weight="bold" transform="rotate(-90 70 200)">Sugar-Phosphate Backbone</text>
  <text x="430" y="200" fill="#3b82f6" font-size="12" font-weight="bold" transform="rotate(-90 430 200)">Sugar-Phosphate Backbone</text>
  
  <!-- Base pairing rules -->
  <rect x="50" y="20" width="180" height="25" fill="#1f2937" rx="5"/>
  <text x="140" y="38" fill="#fca5a5" font-size="13" text-anchor="middle" font-weight="bold">A pairs with T</text>
  
  <rect x="270" y="20" width="180" height="25" fill="#1f2937" rx="5"/>
  <text x="360" y="38" fill="#86efac" font-size="13" text-anchor="middle" font-weight="bold">G pairs with C</text>
  
  <!-- Title -->
  <text x="250" y="575" fill="#1f2937" font-size="16" text-anchor="middle" font-weight="bold">DNA Double Helix</text>
</svg>`,
        description: 'DNA double helix with complementary base pairing: A-T (2 bonds) and G-C (3 bonds). Two antiparallel sugar-phosphate backbones.'
      },
      {
        type: 'svg',
        title: 'Central Dogma: DNA → RNA → Protein',
        content: `<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <!-- DNA (Nucleus) -->
  <circle cx="150" cy="200" r="100" fill="#ddd6fe" stroke="#7c3aed" stroke-width="3"/>
  <text x="150" y="140" fill="#5b21b6" font-size="16" text-anchor="middle" font-weight="bold">NUCLEUS</text>
  
  <!-- DNA double helix representation -->
  <path d="M 130 180 Q 140 170 150 180 Q 160 190 170 180" stroke="#ef4444" stroke-width="3" fill="none"/>
  <path d="M 130 200 Q 140 210 150 200 Q 160 190 170 200" stroke="#ef4444" stroke-width="3" fill="none"/>
  <path d="M 130 220 Q 140 230 150 220 Q 160 210 170 220" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="150" y="255" fill="#7c3aed" font-size="14" text-anchor="middle" font-weight="bold">DNA</text>
  
  <!-- Transcription arrow -->
  <defs>
    <marker id="arrow1" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <polygon points="0 0, 12 6, 0 12" fill="#10b981"/>
    </marker>
  </defs>
  <line x1="250" y1="200" x2="330" y2="200" stroke="#10b981" stroke-width="4" marker-end="url(#arrow1)"/>
  <text x="290" y="190" fill="#10b981" font-size="14" text-anchor="middle" font-weight="bold">Transcription</text>
  <text x="290" y="220" fill="#059669" font-size="11" text-anchor="middle">(DNA → RNA)</text>
  
  <!-- mRNA -->
  <rect x="340" y="160" width="120" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="3" rx="10"/>
  <path d="M 360 200 L 370 195 L 380 200 L 390 195 L 400 200 L 410 195 L 420 200 L 430 195 L 440 200" 
        stroke="#f59e0b" stroke-width="3" fill="none"/>
  <text x="400" y="230" fill="#ea580c" font-size="14" text-anchor="middle" font-weight="bold">mRNA</text>
  
  <!-- Nuclear membrane -->
  <line x1="250" y1="130" x2="250" y2="270" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="260" y="155" fill="#7c3aed" font-size="10" font-weight="bold">Nuclear</text>
  <text x="260" y="168" fill="#7c3aed" font-size="10" font-weight="bold">Membrane</text>
  
  <!-- Translation arrow -->
  <marker id="arrow2" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
    <polygon points="0 0, 12 6, 0 12" fill="#3b82f6"/>
  </marker>
  <line x1="470" y1="200" x2="530" y2="200" stroke="#3b82f6" stroke-width="4" marker-end="url(#arrow2)"/>
  <text x="500" y="190" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">Translation</text>
  <text x="500" y="220" fill="#2563eb" font-size="11" text-anchor="middle">(RNA → Protein)</text>
  
  <!-- Ribosome and Protein -->
  <ellipse cx="590" cy="200" rx="60" ry="50" fill="#dcfce7" stroke="#22c55e" stroke-width="3"/>
  <text x="590" y="185" fill="#16a34a" font-size="12" text-anchor="middle" font-weight="bold">Ribosome</text>
  
  <!-- Protein chain -->
  <circle cx="565" cy="210" r="8" fill="#f472b6"/>
  <circle cx="580" cy="215" r="8" fill="#60a5fa"/>
  <circle cx="595" cy="220" r="8" fill="#fbbf24"/>
  <circle cx="610" cy="215" r="8" fill="#a78bfa"/>
  <circle cx="625" cy="210" r="8" fill="#34d399"/>
  <text x="595" y="250" fill="#16a34a" font-size="14" text-anchor="middle" font-weight="bold">Protein</text>
  
  <!-- Central Dogma Box -->
  <rect x="200" y="320" width="300" height="60" fill="#1f2937" rx="10"/>
  <text x="350" y="345" fill="#fbbf24" font-size="18" text-anchor="middle" font-weight="bold">Central Dogma</text>
  <text x="350" y="367" fill="#9ca3af" font-size="14" text-anchor="middle">DNA → RNA → Protein</text>
  
  <!-- Title -->
  <text x="350" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Gene Expression</text>
  <text x="350" y="55" fill="#6b7280" font-size="13" text-anchor="middle">How genetic information becomes functional proteins</text>
  
  <!-- Location labels -->
  <text x="150" y="310" fill="#7c3aed" font-size="11" text-anchor="middle" font-style="italic">In nucleus</text>
  <text x="590" y="280" fill="#22c55e" font-size="11" text-anchor="middle" font-style="italic">In cytoplasm</text>
</svg>`,
        description: 'Central Dogma: DNA is transcribed to mRNA in nucleus, then mRNA is translated to protein at ribosomes in cytoplasm.'
      },
      {
        type: 'svg',
        title: 'Punnett Square - Mendelian Genetics',
        content: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Punnett Square Example</text>
  <text x="300" y="52" fill="#6b7280" font-size="13" text-anchor="middle">Cross between two heterozygous parents (Bb × Bb)</text>
  <text x="300" y="70" fill="#6b7280" font-size="12" text-anchor="middle" font-style="italic">B = Brown eyes (dominant), b = blue eyes (recessive)</text>
  
  <!-- Parents -->
  <text x="100" y="110" fill="#7c3aed" font-size="16" font-weight="bold">Parent 1: Bb</text>
  <text x="100" y="130" fill="#6b7280" font-size="12">(Brown eyes)</text>
  
  <text x="450" y="110" fill="#7c3aed" font-size="16" font-weight="bold">Parent 2: Bb</text>
  <text x="450" y="130" fill="#6b7280" font-size="12">(Brown eyes)</text>
  
  <!-- Punnett Square Grid -->
  <!-- Top labels (Parent 2 gametes) -->
  <rect x="280" y="160" width="80" height="40" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="320" y="185" fill="#5b21b6" font-size="20" text-anchor="middle" font-weight="bold">B</text>
  
  <rect x="360" y="160" width="80" height="40" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="400" y="185" fill="#5b21b6" font-size="20" text-anchor="middle" font-weight="bold">b</text>
  
  <!-- Left labels (Parent 1 gametes) -->
  <rect x="200" y="200" width="80" height="80" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="240" y="250" fill="#5b21b6" font-size="20" text-anchor="middle" font-weight="bold">B</text>
  
  <rect x="200" y="280" width="80" height="80" fill="#ddd6fe" stroke="#7c3aed" stroke-width="2"/>
  <text x="240" y="330" fill="#5b21b6" font-size="20" text-anchor="middle" font-weight="bold">b</text>
  
  <!-- Offspring cells -->
  <!-- BB (top-left) -->
  <rect x="280" y="200" width="80" height="80" fill="#86efac" stroke="#22c55e" stroke-width="3"/>
  <text x="320" y="245" fill="#14532d" font-size="22" text-anchor="middle" font-weight="bold">BB</text>
  <text x="320" y="262" fill="#16a34a" font-size="11" text-anchor="middle">Brown</text>
  
  <!-- Bb (top-right) -->
  <rect x="360" y="200" width="80" height="80" fill="#86efac" stroke="#22c55e" stroke-width="3"/>
  <text x="400" y="245" fill="#14532d" font-size="22" text-anchor="middle" font-weight="bold">Bb</text>
  <text x="400" y="262" fill="#16a34a" font-size="11" text-anchor="middle">Brown</text>
  
  <!-- Bb (bottom-left) -->
  <rect x="280" y="280" width="80" height="80" fill="#86efac" stroke="#22c55e" stroke-width="3"/>
  <text x="320" y="325" fill="#14532d" font-size="22" text-anchor="middle" font-weight="bold">Bb</text>
  <text x="320" y="342" fill="#16a34a" font-size="11" text-anchor="middle">Brown</text>
  
  <!-- bb (bottom-right) -->
  <rect x="360" y="280" width="80" height="80" fill="#93c5fd" stroke="#3b82f6" stroke-width="3"/>
  <text x="400" y="325" fill="#1e3a8a" font-size="22" text-anchor="middle" font-weight="bold">bb</text>
  <text x="400" y="342" fill="#2563eb" font-size="11" text-anchor="middle">Blue</text>
  
  <!-- Results -->
  <rect x="100" y="390" width="400" height="100" fill="#f3f4f6" rx="10"/>
  <text x="300" y="415" fill="#1f2937" font-size="16" text-anchor="middle" font-weight="bold">Results:</text>
  
  <text x="300" y="440" fill="#22c55e" font-size="14" text-anchor="middle" font-weight="bold">Genotypes: 1 BB : 2 Bb : 1 bb</text>
  <text x="300" y="460" fill="#1f2937" font-size="14" text-anchor="middle">Phenotypes: 3 Brown : 1 Blue (75% : 25%)</text>
  <text x="300" y="478" fill="#6b7280" font-size="12" text-anchor="middle" font-style="italic">3:1 ratio is classic Mendelian inheritance!</text>
</svg>`,
        description: 'Punnett square shows offspring from Bb × Bb cross: 25% BB, 50% Bb, 25% bb. Phenotypic ratio: 3 brown : 1 blue eyes.'
      }
    ],

    examples: [
      {
        question: 'A DNA sequence is: ATGCGA. What is the complementary strand?',
        solution: 'TACGCT',
        steps: [
          'Use base pairing rules: A pairs with T, G pairs with C',
          'Original: A T G C G A',
          'Complement: T A C G C T',
          'A → T',
          'T → A',
          'G → C',
          'Therefore: TACGCT'
        ]
      },
      {
        question: 'Two heterozygous brown-eyed parents (Bb) have children. What\'s the probability their child has blue eyes (bb)?',
        solution: '25% or 1/4',
        steps: [
          'Use Punnett square: Bb × Bb',
          'Parent gametes: B and b from each',
          'Possible offspring: BB, Bb, Bb, bb',
          'Genotype ratio: 1 BB : 2 Bb : 1 bb',
          'Blue eyes only with bb genotype',
          'Probability = 1/4 = 25%'
        ]
      },
      {
        question: 'Why do children inherit mitochondrial DNA only from their mother?',
        solution: 'Only egg contributes mitochondria to offspring',
        steps: [
          'Mitochondria have their own DNA (separate from nuclear DNA)',
          'Egg cells contain many mitochondria',
          'Sperm cells have very few mitochondria (in tail)',
          'During fertilization, only sperm nucleus enters egg',
          'Sperm tail (with mitochondria) remains outside',
          'All offspring mitochondria come from mother\'s egg'
        ]
      }
    ],

    keyPoints: [
      'DNA structure: Double helix with A-T and G-C base pairing',
      'Gene: Segment of DNA coding for a protein',
      'Central Dogma: DNA → RNA → Protein (transcription then translation)',
      'Dominant alleles mask recessive alleles in heterozygotes',
      'Punnett squares predict offspring genotypes and phenotypes',
      'Mutations create genetic variation for evolution',
      'Humans have 46 chromosomes (23 pairs) in each cell'
    ],

    applications: [
      'Genetic Testing: Identify disease risk, ancestry, paternity',
      'Gene Therapy: Treat genetic disorders by fixing faulty genes',
      'Forensics: DNA fingerprinting solves crimes',
      'Agriculture: Selective breeding for desired traits in crops/livestock',
      'Personalized Medicine: Tailor treatments based on genetic makeup',
      'CRISPR: Gene editing technology to modify DNA sequences'
    ]
  },

  // ===== BIOLOGY TOPIC 3: Evolution & Natural Selection (FULL) =====
  {
    id: 'biology-evolution',
    title: 'Evolution & Natural Selection',
    category: 'biology',
    difficulty: 'intermediate',
    icon: '🦎',
    description: 'Understand how species change over time through natural selection and adaptation.',
    
    theory: `**Evolution** is the change in heritable characteristics of populations over successive generations. It's the unifying theory that explains the diversity of life on Earth.

**Charles Darwin's Theory of Evolution by Natural Selection (1859):**

**Key Observations:**
1. **Overproduction:** Species produce more offspring than can survive
2. **Variation:** Individuals in a population show variation in traits
3. **Competition:** Organisms compete for limited resources
4. **Survival:** Some variants are better suited to survive and reproduce

**Natural Selection:**
Individuals with advantageous traits are more likely to survive and reproduce, passing those traits to offspring.

**Four Conditions for Natural Selection:**
1. **Variation:** Differences exist in traits among individuals
2. **Heritability:** Traits must be passed from parents to offspring
3. **Differential Survival:** Some variants survive better than others
4. **Differential Reproduction:** Survivors produce more offspring

**"Survival of the Fittest":**
- "Fittest" = best adapted to environment
- NOT strongest or smartest necessarily!
- Depends entirely on environmental context

**Evidence for Evolution:**

**1. Fossil Record:**
- Shows progression of life forms over time
- Transitional fossils link major groups
- Example: Tiktaalik (fish-to-tetrapod transition)

**2. Comparative Anatomy:**
- **Homologous structures:** Same structure, different function
  - Human arm, whale flipper, bat wing (same bones!)
  - Indicates common ancestry
- **Vestigial structures:** Reduced, functionless remnants
  - Human appendix, wisdom teeth, tailbone
  - Whale hip bones

**3. Embryology:**
- Similar embryonic development in related species
- All vertebrate embryos have gill slits, tail

**4. Molecular Biology:**
- DNA/protein similarities reflect evolutionary relationships
- More similar DNA = more recent common ancestor
- Humans share ~99% DNA with chimpanzees
- Humans share ~60% DNA with fruit flies!

**5. Biogeography:**
- Geographic distribution of species
- Island species resemble mainland ancestors
- Example: Galápagos finches

**Types of Evolution:**

**Convergent Evolution:**
- Unrelated species evolve similar traits
- Due to similar environmental pressures
- Example: Wings in bats (mammals), birds, insects

**Divergent Evolution:**
- Related species become more different
- Adapt to different environments
- Example: Darwin's finches (different beak shapes)

**Coevolution:**
- Two species evolve together
- Example: Flowers and pollinators

**Mechanisms of Evolution:**

**1. Natural Selection:** Differential survival and reproduction
**2. Mutation:** Source of new genetic variation
**3. Gene Flow:** Migration between populations
**4. Genetic Drift:** Random changes in allele frequencies
**5. Sexual Selection:** Traits that increase mating success

**Speciation:**
Formation of new species when populations become reproductively isolated.

**Why Evolution Matters:**
- Understanding antibiotic resistance in bacteria
- Predicting virus evolution (flu, COVID-19)
- Conservation of endangered species
- Agriculture: breeding resistant crops
- Medicine: evolutionary medicine treats disease
- Explains unity and diversity of all life`,

    formulas: [
      'Fitness = Reproductive success relative to others',
      'Allele Frequency Change = Δf = s × f × (1-f) (selection)',
      'Hardy-Weinberg Equilibrium: p² + 2pq + q² = 1',
      'p + q = 1 (where p, q = allele frequencies)',
      'Evolution occurs when allele frequencies change',
    ],

    diagrams: [
      {
        type: 'svg',
        title: 'Natural Selection - Peppered Moth Example',
        content: `<svg viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="350" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Natural Selection: Peppered Moths</text>
  <text x="350" y="52" fill="#6b7280" font-size="13" text-anchor="middle">Industrial Revolution in England (1800s)</text>
  
  <!-- BEFORE: Clean Environment -->
  <rect x="50" y="80" width="280" height="180" fill="#f3f4f6" stroke="#6b7280" stroke-width="3" rx="10"/>
  <text x="190" y="105" fill="#1f2937" font-size="16" text-anchor="middle" font-weight="bold">BEFORE (Clean Trees)</text>
  
  <!-- Light tree trunk -->
  <rect x="100" y="120" width="180" height="120" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>
  <path d="M 140 120 L 145 240" stroke="#9ca3af" stroke-width="2"/>
  <path d="M 200 120 L 195 240" stroke="#9ca3af" stroke-width="2"/>
  <path d="M 240 120 L 238 240" stroke="#9ca3af" stroke-width="2"/>
  
  <!-- Light moths (camouflaged) - more -->
  <ellipse cx="140" cy="180" rx="18" ry="12" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
  <ellipse cx="200" cy="160" rx="18" ry="12" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
  <ellipse cx="240" cy="200" rx="18" ry="12" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
  <ellipse cx="170" cy="220" rx="18" ry="12" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
  
  <!-- Dark moths (visible) - fewer -->
  <ellipse cx="220" cy="190" rx="18" ry="12" fill="#374151" stroke="#1f2937" stroke-width="2"/>
  
  <!-- Bird predator -->
  <text x="250" y="145" font-size="30">🦅</text>
  <line x1="255" y1="150" x2="220" y2="190" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
  
  <text x="190" y="280" fill="#10b981" font-size="12" text-anchor="middle" font-weight="bold">Light moths survive better ✓</text>
  
  <!-- AFTER: Polluted Environment -->
  <rect x="370" y="80" width="280" height="180" fill="#f3f4f6" stroke="#6b7280" stroke-width="3" rx="10"/>
  <text x="510" y="105" fill="#1f2937" font-size="16" text-anchor="middle" font-weight="bold">AFTER (Polluted Trees)</text>
  
  <!-- Dark tree trunk -->
  <rect x="420" y="120" width="180" height="120" fill="#374151" stroke="#1f2937" stroke-width="2"/>
  <path d="M 460 120 L 465 240" stroke="#1f2937" stroke-width="2"/>
  <path d="M 520 120 L 515 240" stroke="#1f2937" stroke-width="2"/>
  <path d="M 560 120 L 558 240" stroke="#1f2937" stroke-width="2"/>
  
  <!-- Dark moths (camouflaged) - more -->
  <ellipse cx="460" cy="180" rx="18" ry="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
  <ellipse cx="520" cy="160" rx="18" ry="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
  <ellipse cx="560" cy="200" rx="18" ry="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
  <ellipse cx="490" cy="220" rx="18" ry="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
  
  <!-- Light moths (visible) - fewer -->
  <ellipse cx="540" cy="190" rx="18" ry="12" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/>
  
  <!-- Bird predator -->
  <text x="570" y="145" font-size="30">🦅</text>
  <line x1="575" y1="150" x2="540" y2="190" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
  
  <text x="510" y="280" fill="#10b981" font-size="12" text-anchor="middle" font-weight="bold">Dark moths survive better ✓</text>
  
  <!-- Natural Selection Process -->
  <rect x="50" y="310" width="600" height="170" fill="#1f2937" rx="10"/>
  <text x="350" y="335" fill="#fbbf24" font-size="18" text-anchor="middle" font-weight="bold">Natural Selection in Action</text>
  
  <!-- Step 1 -->
  <text x="70" y="365" fill="#10b981" font-size="14" font-weight="bold">1. Variation:</text>
  <text x="90" y="385" fill="#9ca3af" font-size="12">Population has light and dark moths</text>
  
  <!-- Step 2 -->
  <text x="70" y="415" fill="#3b82f6" font-size="14" font-weight="bold">2. Environmental Change:</text>
  <text x="90" y="435" fill="#9ca3af" font-size="12">Industrial pollution darkens trees</text>
  
  <!-- Step 3 -->
  <text x="370" y="365" fill="#ef4444" font-size="14" font-weight="bold">3. Differential Survival:</text>
  <text x="390" y="385" fill="#9ca3af" font-size="12">Birds eat visible light moths</text>
  
  <!-- Step 4 -->
  <text x="370" y="415" fill="#f59e0b" font-size="14" font-weight="bold">4. Evolution:</text>
  <text x="390" y="435" fill="#9ca3af" font-size="12">Dark moth frequency increases</text>
  
  <!-- Conclusion -->
  <text x="350" y="465" fill="#8b5cf6" font-size="13" text-anchor="middle" font-style="italic">Population adapts to environment over generations!</text>
</svg>`,
        description: 'Peppered moths evolved due to industrial pollution. Light moths survived on clean trees, dark moths on polluted trees - natural selection in action!'
      },
      {
        type: 'svg',
        title: 'Homologous Structures - Evidence for Evolution',
        content: `<svg viewBox="0 0 700 450" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="350" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Homologous Structures</text>
  <text x="350" y="52" fill="#6b7280" font-size="13" text-anchor="middle">Same bones, different functions - evidence of common ancestry</text>
  
  <!-- Human Arm -->
  <g id="human">
    <text x="120" y="95" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">HUMAN ARM</text>
    <text x="120" y="112" fill="#6b7280" font-size="11" text-anchor="middle">(Grasping)</text>
    
    <!-- Humerus -->
    <rect x="80" y="130" width="15" height="50" fill="#ef4444" stroke="#dc2626" stroke-width="2" rx="3"/>
    <text x="105" y="160" fill="#dc2626" font-size="9" font-weight="bold">Humerus</text>
    
    <!-- Radius/Ulna -->
    <rect x="75" y="185" width="8" height="45" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    <rect x="87" y="185" width="8" height="45" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    <text x="115" y="210" fill="#059669" font-size="9" font-weight="bold">Radius/Ulna</text>
    
    <!-- Carpals (wrist) -->
    <circle cx="81" cy="235" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="90" cy="235" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <text x="110" y="240" fill="#f59e0b" font-size="9" font-weight="bold">Carpals</text>
    
    <!-- Metacarpals and Phalanges (fingers) -->
    <rect x="70" y="242" width="4" height="25" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="77" y="242" width="4" height="28" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="84" y="242" width="4" height="30" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="91" y="242" width="4" height="28" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="98" y="242" width="4" height="22" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <text x="115" y="260" fill="#7c3aed" font-size="9" font-weight="bold">Phalanges</text>
  </g>
  
  <!-- Cat Leg -->
  <g id="cat">
    <text x="270" y="95" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">CAT LEG</text>
    <text x="270" y="112" fill="#6b7280" font-size="11" text-anchor="middle">(Walking)</text>
    
    <!-- Humerus -->
    <rect x="230" y="130" width="15" height="50" fill="#ef4444" stroke="#dc2626" stroke-width="2" rx="3"/>
    
    <!-- Radius/Ulna -->
    <rect x="225" y="185" width="8" height="45" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    <rect x="237" y="185" width="8" height="45" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    
    <!-- Carpals -->
    <circle cx="231" cy="235" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="240" cy="235" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    
    <!-- Metacarpals/Phalanges -->
    <rect x="220" y="242" width="4" height="20" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="227" y="242" width="4" height="22" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="234" y="242" width="4" height="22" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="241" y="242" width="4" height="22" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="248" y="242" width="4" height="18" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
  </g>
  
  <!-- Whale Flipper -->
  <g id="whale">
    <text x="420" y="95" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">WHALE FLIPPER</text>
    <text x="420" y="112" fill="#6b7280" font-size="11" text-anchor="middle">(Swimming)</text>
    
    <!-- Humerus -->
    <rect x="380" y="130" width="18" height="45" fill="#ef4444" stroke="#dc2626" stroke-width="2" rx="3"/>
    
    <!-- Radius/Ulna -->
    <rect x="377" y="180" width="10" height="35" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    <rect x="391" y="180" width="10" height="35" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    
    <!-- Carpals -->
    <circle cx="383" cy="220" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="394" cy="220" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    
    <!-- Elongated Phalanges -->
    <rect x="372" y="227" width="5" height="40" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="380" y="227" width="5" height="42" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="388" y="227" width="5" height="42" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="396" y="227" width="5" height="42" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="404" y="227" width="5" height="38" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
  </g>
  
  <!-- Bat Wing -->
  <g id="bat">
    <text x="570" y="95" fill="#3b82f6" font-size="14" text-anchor="middle" font-weight="bold">BAT WING</text>
    <text x="570" y="112" fill="#6b7280" font-size="11" text-anchor="middle">(Flying)</text>
    
    <!-- Humerus -->
    <rect x="530" y="130" width="15" height="40" fill="#ef4444" stroke="#dc2626" stroke-width="2" rx="3"/>
    
    <!-- Radius/Ulna -->
    <rect x="527" y="175" width="8" height="35" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    <rect x="537" y="175" width="8" height="35" fill="#10b981" stroke="#059669" stroke-width="2" rx="2"/>
    
    <!-- Carpals -->
    <circle cx="532" cy="215" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    <circle cx="542" cy="215" r="4" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
    
    <!-- Very long Phalanges (fingers) -->
    <rect x="520" y="222" width="3" height="55" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="527" y="222" width="3" height="60" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="534" y="222" width="3" height="62" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="541" y="222" width="3" height="60" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    <rect x="548" y="222" width="3" height="52" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1" rx="1"/>
    
    <!-- Wing membrane -->
    <path d="M 520 230 Q 510 250 520 277 L 551 282 Q 560 255 551 222 Z" 
          fill="#a78bfa" opacity="0.3" stroke="#7c3aed" stroke-width="1"/>
  </g>
  
  <!-- Legend -->
  <rect x="150" y="320" width="400" height="110" fill="#f3f4f6" stroke="#6b7280" stroke-width="2" rx="8"/>
  <text x="350" y="345" fill="#1f2937" font-size="15" text-anchor="middle" font-weight="bold">Same Bones, Different Adaptations</text>
  
  <rect x="170" y="360" width="15" height="10" fill="#ef4444"/>
  <text x="195" y="369" fill="#1f2937" font-size="11">Humerus (upper arm/leg)</text>
  
  <rect x="170" y="380" width="15" height="10" fill="#10b981"/>
  <text x="195" y="389" fill="#1f2937" font-size="11">Radius & Ulna (forearm)</text>
  
  <rect x="370" y="360" width="15" height="10" fill="#fbbf24"/>
  <text x="395" y="369" fill="#1f2937" font-size="11">Carpals (wrist)</text>
  
  <rect x="370" y="380" width="15" height="10" fill="#8b5cf6"/>
  <text x="395" y="389" fill="#1f2937" font-size="11">Metacarpals & Phalanges (hand/fingers)</text>
  
  <text x="350" y="415" fill="#7c3aed" font-size="12" text-anchor="middle" font-weight="bold" font-style="italic">These structures prove common ancestry!</text>
</svg>`,
        description: 'Homologous structures: Human arm, cat leg, whale flipper, bat wing all have same bones arranged differently - evidence of evolution from common ancestor.'
      },
      {
        type: 'svg',
        title: 'Evolutionary Tree - Common Ancestry',
        content: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
  <!-- Title -->
  <text x="300" y="30" fill="#1f2937" font-size="20" text-anchor="middle" font-weight="bold">Evolutionary Tree of Life</text>
  <text x="300" y="52" fill="#6b7280" font-size="13" text-anchor="middle">All species share common ancestors</text>
  
  <!-- Tree trunk (common ancestor) -->
  <rect x="280" y="420" width="40" height="60" fill="#92400e" stroke="#78350f" stroke-width="3" rx="5"/>
  <text x="300" y="465" fill="#fef3c7" font-size="11" text-anchor="middle" font-weight="bold">Common</text>
  <text x="300" y="478" fill="#fef3c7" font-size="11" text-anchor="middle" font-weight="bold">Ancestor</text>
  
  <!-- Main branches -->
  <path d="M 300 420 Q 250 350 200 280" stroke="#92400e" stroke-width="8" fill="none"/>
  <path d="M 300 420 Q 350 350 400 280" stroke="#92400e" stroke-width="8" fill="none"/>
  
  <!-- Left major branch splits -->
  <path d="M 200 280 Q 170 220 140 160" stroke="#92400e" stroke-width="6" fill="none"/>
  <path d="M 200 280 Q 210 220 220 160" stroke="#92400e" stroke-width="6" fill="none"/>
  
  <!-- Right major branch splits -->
  <path d="M 400 280 Q 380 220 360 160" stroke="#92400e" stroke-width="6" fill="none"/>
  <path d="M 400 280 Q 430 220 460 160" stroke="#92400e" stroke-width="6" fill="none"/>
  
  <!-- Final branches to species -->
  <line x1="140" y1="160" x2="100" y2="80" stroke="#92400e" stroke-width="4"/>
  <line x1="140" y1="160" x2="160" y2="80" stroke="#92400e" stroke-width="4"/>
  
  <line x1="220" y1="160" x2="200" y2="80" stroke="#92400e" stroke-width="4"/>
  <line x1="220" y1="160" x2="240" y2="80" stroke="#92400e" stroke-width="4"/>
  
  <line x1="360" y1="160" x2="340" y2="80" stroke="#92400e" stroke-width="4"/>
  <line x1="360" y1="160" x2="380" y2="80" stroke="#92400e" stroke-width="4"/>
  
  <line x1="460" y1="160" x2="440" y2="80" stroke="#92400e" stroke-width="4"/>
  <line x1="460" y1="160" x2="500" y2="80" stroke="#92400e" stroke-width="4"/>
  
  <!-- Modern species (leaves) -->
  <!-- Fish -->
  <circle cx="100" cy="70" r="25" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
  <text x="100" y="77" fill="white" font-size="20" text-anchor="middle">🐟</text>
  <text x="100" y="50" fill="#3b82f6" font-size="11" text-anchor="middle" font-weight="bold">Fish</text>
  
  <!-- Amphibian -->
  <circle cx="160" cy="70" r="25" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="160" y="77" fill="white" font-size="20" text-anchor="middle">🐸</text>
  <text x="160" y="50" fill="#10b981" font-size="11" text-anchor="middle" font-weight="bold">Amphibian</text>
  
  <!-- Reptile -->
  <circle cx="200" cy="70" r="25" fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
  <text x="200" y="77" fill="white" font-size="20" text-anchor="middle">🦎</text>
  <text x="200" y="50" fill="#22c55e" font-size="11" text-anchor="middle" font-weight="bold">Reptile</text>
  
  <!-- Bird -->
  <circle cx="240" cy="70" r="25" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/>
  <text x="240" y="77" fill="white" font-size="20" text-anchor="middle">🦜</text>
  <text x="240" y="50" fill="#fbbf24" font-size="11" text-anchor="middle" font-weight="bold">Bird</text>
  
  <!-- Dog -->
  <circle cx="340" cy="70" r="25" fill="#f59e0b" stroke="#ea580c" stroke-width="2"/>
  <text x="340" y="77" fill="white" font-size="20" text-anchor="middle">🐕</text>
  <text x="340" y="50" fill="#f59e0b" font-size="11" text-anchor="middle" font-weight="bold">Dog</text>
  
  <!-- Cat -->
  <circle cx="380" cy="70" r="25" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
  <text x="380" y="77" fill="white" font-size="20" text-anchor="middle">🐈</text>
  <text x="380" y="50" fill="#ef4444" font-size="11" text-anchor="middle" font-weight="bold">Cat</text>
  
  <!-- Monkey -->
  <circle cx="440" cy="70" r="25" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/>
  <text x="440" y="77" fill="white" font-size="20" text-anchor="middle">🐵</text>
  <text x="440" y="50" fill="#a78bfa" font-size="11" text-anchor="middle" font-weight="bold">Monkey</text>
  
  <!-- Human -->
  <circle cx="500" cy="70" r="25" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
  <text x="500" y="77" fill="white" font-size="20" text-anchor="middle">🧍</text>
  <text x="500" y="50" fill="#8b5cf6" font-size="11" text-anchor="middle" font-weight="bold">Human</text>
  
  <!-- Time arrow -->
  <defs>
    <marker id="arrowTime" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#6b7280"/>
    </marker>
  </defs>
  <line x1="30" y1="450" x2="30" y2="100" stroke="#6b7280" stroke-width="3" marker-end="url(#arrowTime)"/>
  <text x="15" y="280" fill="#6b7280" font-size="13" font-weight="bold" transform="rotate(-90 15 280)">Time (millions of years)</text>
  
  <!-- Explanation box -->
  <rect x="100" y="370" width="400" height="40" fill="#1f2937" rx="8"/>
  <text x="300" y="393" fill="#fbbf24" font-size="13" text-anchor="middle" font-weight="bold">Branch points = common ancestors</text>
  <text x="300" y="407" fill="#9ca3af" font-size="11" text-anchor="middle">Closer branches = more recent common ancestor</text>
</svg>`,
        description: 'Evolutionary tree shows how all species descend from common ancestors. Branch points represent when species diverged. Closer species share more recent ancestors.'
      }
    ],

    examples: [
      {
        question: 'Why do antibiotics become less effective over time (antibiotic resistance)?',
        solution: 'Natural selection favors resistant bacteria',
        steps: [
          'Bacterial population has genetic variation',
          'Some bacteria have mutations conferring antibiotic resistance',
          'Antibiotic kills non-resistant bacteria',
          'Resistant bacteria survive and reproduce',
          'Next generation has higher proportion of resistant bacteria',
          'Over time, population evolves resistance through natural selection'
        ]
      },
      {
        question: 'Why do whales have hip bones even though they don\'t have hind legs?',
        solution: 'Vestigial structures from land-dwelling ancestors',
        steps: [
          'Whales evolved from land mammals (~50 million years ago)',
          'Ancestors had functional hind legs and hip bones',
          'As whales adapted to ocean life, hind legs became unnecessary',
          'Natural selection reduced leg size over generations',
          'Hip bones remain as vestigial structures',
          'Evidence for whale evolution from four-legged mammals'
        ]
      },
      {
        question: 'How do Darwin\'s finches demonstrate evolution?',
        solution: 'Different beak shapes evolved for different food sources',
        steps: [
          'Original finches arrived at Galápagos Islands',
          'Different islands had different food sources (seeds, insects, cactus)',
          'Random mutations produced beak shape variation',
          'Finches with advantageous beak shapes survived better',
          'Each island population evolved different beak adaptations',
          'Result: 13+ species with specialized beaks (adaptive radiation)'
        ]
      }
    ],

    keyPoints: [
      'Evolution: Change in heritable traits over generations',
      'Natural selection: Survival and reproduction of the fittest',
      'Variation, heritability, and differential survival drive evolution',
      'Fossil record, comparative anatomy, DNA show evidence for evolution',
      'Homologous structures indicate common ancestry',
      'Vestigial organs are remnants from evolutionary ancestors',
      'Evolution explains both unity (common ancestry) and diversity of life'
    ],

    applications: [
      'Medicine: Understanding antibiotic resistance evolution',
      'Vaccines: Predicting how viruses will evolve (flu shots)',
      'Agriculture: Breeding crops and livestock for desired traits',
      'Conservation: Preserving genetic diversity in endangered species',
      'Pest Control: Managing pesticide resistance in insects',
      'Biotechnology: Using evolutionary principles to engineer proteins'
    ]
  },

  // ===== BIOLOGY TOPIC 4: Ecology & Ecosystems (THEORY ONLY) =====
  {
    id: 'biology-ecology',
    title: 'Ecology & Ecosystems',
    category: 'biology',
    difficulty: 'intermediate',
    icon: '🌍',
    description: 'Explore the interactions between organisms and their environment, energy flow, and ecosystem dynamics.',
    
    theory: `**Ecology** is the study of interactions between organisms and their environment, including both living (biotic) and non-living (abiotic) factors.

**Levels of Organization:**
1. **Organism:** Individual living thing
2. **Population:** Group of same species in an area
3. **Community:** All populations in an area (all species)
4. **Ecosystem:** Community + abiotic factors (energy, water, nutrients)
5. **Biome:** Large ecosystem type (desert, rainforest, tundra)
6. **Biosphere:** All life on Earth

**Energy Flow in Ecosystems:**

**Trophic Levels:**
- **Producers (Autotrophs):** Make own food via photosynthesis (plants, algae)
- **Primary Consumers:** Herbivores eat producers (deer, rabbits, insects)
- **Secondary Consumers:** Carnivores eat herbivores (snakes, frogs)
- **Tertiary Consumers:** Top predators (eagles, lions, sharks)
- **Decomposers:** Break down dead matter (bacteria, fungi)

**10% Rule:**
Only ~10% of energy transfers between trophic levels.
- Why? Energy lost as heat, movement, undigested material
- Limits food chain length (usually 4-5 levels max)
- Explains why there are fewer predators than prey

**Food Chains vs Food Webs:**
- **Food Chain:** Linear sequence (grass → rabbit → fox)
- **Food Web:** Complex network of interconnected food chains (more realistic)

**Nutrient Cycles:**

**Water Cycle:**
- Evaporation → Condensation → Precipitation → Runoff
- Essential for all life processes

**Carbon Cycle:**
- Photosynthesis removes CO₂ from atmosphere
- Respiration returns CO₂ to atmosphere
- Fossil fuels store carbon (released by burning)
- Ocean absorption and release

**Nitrogen Cycle:**
- Nitrogen fixation (bacteria convert N₂ to NH₃)
- Nitrification (NH₃ → NO₃⁻)
- Assimilation (plants absorb NO₃⁻)
- Denitrification (bacteria return N₂ to atmosphere)

**Ecological Relationships:**

**Symbiosis:**
- **Mutualism:** Both benefit (bees & flowers, cleaner fish)
- **Commensalism:** One benefits, other unaffected (barnacles on whales)
- **Parasitism:** One benefits, other harmed (tapeworms, ticks)

**Competition:**
- **Intraspecific:** Within same species (lions fighting for territory)
- **Interspecific:** Between different species (lions vs hyenas for food)

**Predation:**
- Predator-prey populations cycle together
- Predators control prey populations
- Prey evolve defenses (camouflage, toxins, speed)

**Population Dynamics:**

**Growth Patterns:**
- **Exponential:** Unlimited resources, J-shaped curve
- **Logistic:** Limited resources, S-shaped curve (levels at carrying capacity)

**Carrying Capacity (K):**
Maximum population size environment can sustain long-term.

**Limiting Factors:**
- Density-dependent: Competition, disease, predation
- Density-independent: Weather, natural disasters

**Succession:**

**Primary Succession:**
- Colonization of bare rock/soil (after volcanic eruption, glacier retreat)
- Pioneer species (lichens, mosses) → grasses → shrubs → trees
- Hundreds to thousands of years

**Secondary Succession:**
- Re-colonization after disturbance (fire, farming, logging)
- Faster than primary (soil already present)
- Decades to centuries

**Human Impact on Ecosystems:**
- Climate change (greenhouse gases)
- Habitat destruction (deforestation, urbanization)
- Pollution (air, water, soil)
- Overexploitation (overfishing, hunting)
- Invasive species
- Biodiversity loss

**Conservation:**
- Protected areas (national parks, reserves)
- Sustainable practices (renewable resources)
- Restoration ecology (habitat restoration)
- Biodiversity preservation
- Reducing carbon footprint`
  },

  // ===== BIOLOGY TOPIC 5: Human Body Systems (THEORY ONLY) =====
  {
    id: 'biology-human-systems',
    title: 'Human Body Systems',
    category: 'biology',
    difficulty: 'advanced',
    icon: '🫀',
    description: 'Understand the structure and function of major human body systems and how they work together.',
    
    theory: `**The Human Body** is a complex organization of cells, tissues, organs, and organ systems working together to maintain life.

**Organization Hierarchy:**
Cells → Tissues → Organs → Organ Systems → Organism

**Major Body Systems:**

**1. Circulatory System (Cardiovascular):**
- **Function:** Transport oxygen, nutrients, hormones, waste
- **Components:** Heart (pump), blood vessels (arteries, veins, capillaries), blood
- **Heart:** Four chambers (2 atria, 2 ventricles), pumps ~5L/min
- **Blood:** Red blood cells (oxygen transport), white blood cells (immune), platelets (clotting), plasma (liquid)

**2. Respiratory System:**
- **Function:** Gas exchange (O₂ in, CO₂ out)
- **Components:** Nose, trachea, bronchi, lungs, alveoli, diaphragm
- **Alveoli:** Tiny air sacs where gas exchange occurs (~300 million)
- **Breathing:** Diaphragm contracts (inhale), relaxes (exhale)

**3. Digestive System:**
- **Function:** Break down food, absorb nutrients, eliminate waste
- **Components:** Mouth, esophagus, stomach, small intestine, large intestine, liver, pancreas
- **Mechanical digestion:** Chewing, churning
- **Chemical digestion:** Enzymes break down molecules
- **Absorption:** Mainly in small intestine (nutrients) and large intestine (water)

**4. Nervous System:**
- **Function:** Control and coordinate body activities, process information
- **Components:** Brain, spinal cord (CNS), nerves (PNS)
- **Brain:** Control center (~86 billion neurons)
- **Neurons:** Transmit electrical signals (action potentials)

**5. Endocrine System:**
- **Function:** Produce and regulate hormones
- **Components:** Pituitary, thyroid, adrenal glands, pancreas, gonads
- **Hormones:** Chemical messengers (insulin, adrenaline, growth hormone, etc.)

**6. Immune System:**
- **Function:** Defend against pathogens and disease
- **Components:** White blood cells, lymph nodes, spleen, thymus
- **Innate immunity:** Non-specific defense (skin, inflammation)
- **Adaptive immunity:** Specific defense (antibodies, T-cells, B-cells)

**7. Muscular System:**
- **Function:** Movement, posture, heat production
- **Types:** Skeletal (voluntary), smooth (involuntary), cardiac (heart)
- **~640 muscles** in human body

**8. Skeletal System:**
- **Function:** Support, protection, movement, blood cell production
- **206 bones** in adult human
- **Bone marrow:** Produces blood cells

**9. Excretory System:**
- **Function:** Remove metabolic waste
- **Components:** Kidneys, ureters, bladder, urethra
- **Kidneys:** Filter blood, produce urine (~180L filtered/day!)

**10. Reproductive System:**
- **Function:** Produce offspring, hormones
- **Male:** Testes, sperm production
- **Female:** Ovaries, egg production, uterus

**Homeostasis:**
The body maintains stable internal conditions (temperature, pH, glucose levels) through feedback mechanisms and system coordination.

**Why Study Human Anatomy?**
- Understanding health and disease
- Medical careers (doctor, nurse, physiotherapist)
- Fitness and nutrition optimization
- Appreciating the complexity of life`
  },

  // ===== BIOLOGY TOPIC 6: Photosynthesis & Cellular Respiration (THEORY ONLY) =====
  {
    id: 'biology-photosynthesis-respiration',
    title: 'Photosynthesis & Cellular Respiration',
    category: 'biology',
    difficulty: 'intermediate',
    icon: '🌱',
    description: 'Learn how organisms convert energy - from sunlight to ATP through interconnected metabolic processes.',
    
    theory: `**Energy Flow in Living Systems** revolves around two complementary processes: photosynthesis (capturing energy) and cellular respiration (releasing energy).

**Photosynthesis:**
Plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.

**Overall Equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**Location:** Chloroplasts (in plant cells)

**Two Stages:**

**1. Light-Dependent Reactions (Thylakoid membranes):**
- Chlorophyll absorbs light energy
- Water molecules split (photolysis): 2H₂O → 4H⁺ + O₂
- Produces ATP and NADPH (energy carriers)
- Releases O₂ as byproduct

**2. Light-Independent Reactions / Calvin Cycle (Stroma):**
- Uses ATP and NADPH from light reactions
- Fixes CO₂ from atmosphere into organic molecules
- Produces glucose (C₆H₁₂O₆)
- Does not require light directly (but needs products from light reactions)

**Key Factors Affecting Photosynthesis:**
- Light intensity (more light = faster rate, up to saturation point)
- CO₂ concentration
- Temperature (enzymes work best at optimal temp)
- Water availability

**Cellular Respiration:**
All organisms break down glucose to release energy stored in chemical bonds, producing ATP.

**Overall Equation:**
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP Energy

**Location:** Mitochondria (in eukaryotic cells)

**Three Stages:**

**1. Glycolysis (Cytoplasm):**
- Breaks glucose (6C) into 2 pyruvate molecules (3C each)
- Produces: 2 ATP, 2 NADH
- Occurs with or without oxygen (anaerobic)

**2. Krebs Cycle / Citric Acid Cycle (Mitochondrial Matrix):**
- Pyruvate converted to Acetyl-CoA
- Completes breakdown of glucose
- Produces: 2 ATP, 6 NADH, 2 FADH₂, CO₂
- Requires oxygen (aerobic)

**3. Electron Transport Chain (Inner Mitochondrial Membrane):**
- NADH and FADH₂ donate electrons
- Electrons move through protein complexes
- Creates proton gradient → drives ATP synthesis
- Produces: ~32-34 ATP (most ATP generated here!)
- O₂ is final electron acceptor → forms H₂O

**Total ATP from one glucose:** ~36-38 ATP molecules

**Anaerobic Respiration (Without Oxygen):**

**Fermentation:**
When oxygen is unavailable, cells can still produce ATP through glycolysis + fermentation.

**Lactic Acid Fermentation** (muscle cells, some bacteria):
- Pyruvate → Lactic acid
- Used during intense exercise when oxygen is limited
- Causes muscle fatigue and soreness
- Only produces 2 ATP per glucose (much less efficient)

**Alcoholic Fermentation** (yeast, some bacteria):
- Pyruvate → Ethanol + CO₂
- Used in brewing beer, making wine, baking bread
- Yeast produces alcohol and CO₂ bubbles
- Also only 2 ATP per glucose

**The Connection:**
Photosynthesis and cellular respiration are complementary:
- Photosynthesis: Uses CO₂ + H₂O → Produces glucose + O₂
- Cellular Respiration: Uses glucose + O₂ → Produces CO₂ + H₂O

They form a cycle! The products of one process are the reactants of the other, creating an energy flow through ecosystems.

**Why This Matters:**
- **Food Production:** Agriculture depends on photosynthesis
- **Energy:** Understanding cellular respiration helps optimize human performance
- **Climate:** Plants absorb CO₂ through photosynthesis (carbon sequestration)
- **Medicine:** Many diseases involve mitochondrial dysfunction
- **Biotechnology:** Fermentation used in food and drug production
- **Evolution:** These processes evolved billions of years ago and are conserved across all life

The ability to capture and utilize energy is what makes life possible on Earth!`
  }
];

// Update STATIC_MODULES export to include all subjects
export const STATIC_MODULES = {
  math: mathTopics,
  physics: physicsTopics,
  chemistry: chemistryTopics,
  biology: biologyTopics,
};