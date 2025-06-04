
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MatrixInput } from '@/components/MatrixInput';
import { SolutionDisplay } from '@/components/SolutionDisplay';
import { solveHungarian } from '@/utils/hungarianAlgorithm';
import { Calculator, Target, Minimize2, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [objective, setObjective] = useState<'minimize' | 'maximize'>('minimize');
  const [solution, setSolution] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();

  const initializeMatrix = (size: number) => {
    const newMatrix = Array(size).fill(null).map(() => Array(size).fill(0));
    setMatrix(newMatrix);
    setSolution(null);
  };

  const validateMatrixSize = (size: number): boolean => {
    if (!Number.isInteger(size) || size < 2 || size > 10) {
      toast({
        title: "Error de validación",
        description: "El tamaño de la matriz debe ser entre 2x2 y 10x10",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSizeChange = (size: string) => {
    const newSize = parseInt(size);
    
    if (!validateMatrixSize(newSize)) {
      return;
    }

    setMatrixSize(newSize);
    initializeMatrix(newSize);
    
    console.log(`Matriz inicializada con tamaño ${newSize}x${newSize}`);
  };

  const validateMatrixValues = (matrix: number[][]): boolean => {
    if (!matrix || matrix.length === 0) {
      toast({
        title: "Error de validación",
        description: "La matriz no puede estar vacía",
        variant: "destructive"
      });
      return false;
    }

    // Verificar que la matriz sea cuadrada
    const size = matrix.length;
    for (let i = 0; i < size; i++) {
      if (!matrix[i] || matrix[i].length !== size) {
        toast({
          title: "Error de validación",
          description: "La matriz debe ser cuadrada (mismo número de filas y columnas)",
          variant: "destructive"
        });
        return false;
      }
    }

    // Verificar que todos los valores sean números válidos
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = matrix[i][j];
        if (value === null || value === undefined || isNaN(value)) {
          toast({
            title: "Error de validación",
            description: `Valor inválido en posición [${i+1}, ${j+1}]. Todos los valores deben ser números válidos.`,
            variant: "destructive"
          });
          return false;
        }
        
        // Verificar que no sean valores extremos que puedan causar problemas
        if (!isFinite(value)) {
          toast({
            title: "Error de validación",
            description: `Valor infinito o no válido en posición [${i+1}, ${j+1}]. Use números finitos.`,
            variant: "destructive"
          });
          return false;
        }

        // Verificar rangos razonables para evitar overflow
        if (Math.abs(value) > 1000000) {
          toast({
            title: "Advertencia de validación",
            description: `Valor muy grande en posición [${i+1}, ${j+1}] (${value}). Considere usar valores más pequeños para mejor rendimiento.`,
            variant: "destructive"
          });
        }
      }
    }

    return true;
  };

  const handleMatrixChange = (row: number, col: number, value: number) => {
    // Validar índices
    if (row < 0 || row >= matrixSize || col < 0 || col >= matrixSize) {
      console.error(`Índices fuera de rango: [${row}, ${col}] para matriz ${matrixSize}x${matrixSize}`);
      return;
    }

    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
    
    // Limpiar solución anterior cuando se modifica la matriz
    if (solution) {
      setSolution(null);
    }
  };

  const solveProblem = async () => {
    console.log('Iniciando resolución del problema...');
    console.log('Matriz actual:', matrix);
    console.log('Objetivo:', objective);
    console.log('Tamaño de matriz:', matrixSize);

    // Validaciones previas
    if (!validateMatrixValues(matrix)) {
      return;
    }

    // Verificar que el tamaño de la matriz coincida con matrixSize
    if (matrix.length !== matrixSize || matrix.some(row => row.length !== matrixSize)) {
      toast({
        title: "Error de consistencia",
        description: "El tamaño de la matriz no coincide con el tamaño configurado",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      console.log('Ejecutando algoritmo húngaro...');
      const result = solveHungarian(matrix, objective);
      
      console.log('Resultado obtenido:', result);
      
      // Validar el resultado
      if (!result || !result.assignments || result.assignments.length === 0) {
        throw new Error('El algoritmo no pudo encontrar una solución válida');
      }

      // Verificar que la asignación sea completa
      if (result.assignments.length !== matrixSize) {
        throw new Error(`Asignación incompleta: se esperaban ${matrixSize} asignaciones, se obtuvieron ${result.assignments.length}`);
      }

      setSolution(result);
      
      toast({
        title: "¡Problema resuelto exitosamente!",
        description: `Solución óptima encontrada con costo total: ${Math.round(result.totalCost)}`,
      });

      console.log('Problema resuelto exitosamente');
      
    } catch (error) {
      console.error('Error al resolver el problema:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toast({
        title: "Error al resolver el problema",
        description: `No se pudo resolver el problema de asignación: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const loadExample = () => {
    const examples = {
      3: [
        [82, 83, 69],
        [77, 37, 49],
        [11, 69, 5]
      ],
      4: [
        [82, 83, 69, 92],
        [77, 37, 49, 92],
        [11, 69, 5, 86],
        [8, 9, 98, 23]
      ],
      5: [
        [12, 15, 13, 20, 18],
        [14, 10, 16, 19, 12],
        [16, 18, 11, 15, 17],
        [18, 12, 14, 16, 13],
        [11, 17, 19, 13, 15]
      ]
    };

    const exampleMatrix = examples[matrixSize as keyof typeof examples] || examples[4];
    const newSize = exampleMatrix.length;
    
    setMatrixSize(newSize);
    setMatrix(exampleMatrix);
    setSolution(null);
    
    console.log(`Ejemplo cargado: matriz ${newSize}x${newSize}`);
    
    toast({
      title: "Ejemplo cargado",
      description: `Se ha cargado un ejemplo de matriz ${newSize}x${newSize}`,
    });
  };

  const handleCalculatorClick = () => {
    navigate('/documentation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator 
              className="h-10 w-10 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" 
              onClick={handleCalculatorClick}
            />
            <h1 className="text-4xl font-bold text-gray-900">
              Método Húngaro
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resuelve problemas de asignación óptima usando el algoritmo húngaro. 
            Ingresa tu matriz de costos o beneficios y encuentra la asignación óptima.
          </p>
        </div>

        {/* Configuration Panel */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Configuración del Problema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tamaño de la matriz (n×n)
                </label>
                <Select value={matrixSize.toString()} onValueChange={handleSizeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}×{size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Objetivo
                </label>
                <Select value={objective} onValueChange={(value: 'minimize' | 'maximize') => setObjective(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimize">
                      <div className="flex items-center gap-2">
                        <Minimize2 className="h-4 w-4" />
                        Minimizar costos
                      </div>
                    </SelectItem>
                    <SelectItem value="maximize">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="h-4 w-4" />
                        Maximizar beneficios
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => initializeMatrix(matrixSize)}
                  variant="outline"
                  className="flex-1"
                >
                  Inicializar Matriz
                </Button>
                <Button
                  onClick={loadExample}
                  variant="outline"
                  className="flex-1"
                >
                  Cargar Ejemplo
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Badge variant={objective === 'minimize' ? 'default' : 'secondary'}>
                {objective === 'minimize' ? 'Minimización' : 'Maximización'}
              </Badge>
              <Badge variant="outline">
                Matriz {matrixSize}×{matrixSize}
              </Badge>
              {matrixSize >= 8 && (
                <Badge variant="destructive">
                  Matriz grande - puede tardar más tiempo
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Matrix Input */}
        {matrix.length > 0 && (
          <MatrixInput
            matrix={matrix}
            objective={objective}
            onMatrixChange={handleMatrixChange}
            onSolve={solveProblem}
            isCalculating={isCalculating}
          />
        )}

        {/* Solution Display */}
        {solution && (
          <SolutionDisplay 
            solution={solution} 
            originalMatrix={matrix}
            objective={objective}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
