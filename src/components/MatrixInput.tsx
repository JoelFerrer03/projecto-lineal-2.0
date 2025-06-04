
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Grid3X3, Play, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MatrixInputProps {
  matrix: number[][];
  objective: 'minimize' | 'maximize';
  onMatrixChange: (row: number, col: number, value: number) => void;
  onSolve: () => void;
  isCalculating: boolean;
}

export const MatrixInput: React.FC<MatrixInputProps> = ({
  matrix,
  objective,
  onMatrixChange,
  onSolve,
  isCalculating
}) => {
  const handleInputChange = (row: number, col: number, value: string) => {
    // Permitir valores vacíos temporalmente durante la edición
    if (value === '') {
      onMatrixChange(row, col, 0);
      return;
    }

    // Validar que sea un número
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      console.warn(`Valor inválido ingresado en [${row}, ${col}]: ${value}`);
      return;
    }

    // Validar rangos razonables
    if (Math.abs(numValue) > 1000000) {
      console.warn(`Valor muy grande en [${row}, ${col}]: ${numValue}`);
    }

    onMatrixChange(row, col, numValue);
  };

  const validateMatrix = (): boolean => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const value = matrix[i][j];
        if (isNaN(value) || !isFinite(value)) {
          return false;
        }
      }
    }
    return true;
  };

  const isMatrixValid = validateMatrix();
  const matrixSize = matrix.length;

  // Calcular el ancho de celda apropiado según el tamaño de la matriz
  const getCellWidth = () => {
    if (matrixSize <= 3) return 'w-24';      // Muy amplio para matrices pequeñas
    if (matrixSize <= 4) return 'w-20';      // Amplio para matrices medianas
    if (matrixSize <= 6) return 'w-18';      // Moderado para matrices un poco más grandes
    if (matrixSize <= 8) return 'w-16';      // Ajustado para matrices grandes
    return 'w-20';                           // Más amplio para matrices muy grandes (10x10)
  };

  const cellWidth = getCellWidth();

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Matriz de {objective === 'minimize' ? 'Costos' : 'Beneficios'}
          <Badge variant="outline" className="ml-2">
            {matrixSize}×{matrixSize}
          </Badge>
          {!isMatrixValid && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Datos inválidos
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Column headers */}
              <div className="flex mb-2">
                <div className="w-16"></div>
                {matrix[0]?.map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={`${cellWidth} text-center text-sm font-medium text-gray-600 mr-2`}
                  >
                    T{colIndex + 1}
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center mb-2">
                  {/* Row header */}
                  <div className="w-16 text-sm font-medium text-gray-600 text-right pr-2">
                    R{rowIndex + 1}
                  </div>
                  
                  {/* Row inputs */}
                  {row.map((value, colIndex) => {
                    const cellValue = value || '';
                    const isValidCell = !isNaN(value) && isFinite(value);
                    
                    return (
                      <div key={colIndex} className="mr-2">
                        <Input
                          type="number"
                          value={cellValue}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          className={`${cellWidth} text-center text-sm px-2 ${
                            !isValidCell ? 'border-red-500 bg-red-50' : ''
                          }`}
                          step="0.01"
                          placeholder="0"
                          style={{ minWidth: matrixSize >= 8 ? '80px' : '64px' }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p><strong>R</strong> = Recursos (trabajadores, máquinas, etc.)</p>
          <p><strong>T</strong> = Tareas (trabajos, asignaciones, etc.)</p>
          <p>
            {objective === 'minimize' 
              ? 'Ingresa los costos de asignar cada recurso a cada tarea.'
              : 'Ingresa los beneficios de asignar cada recurso a cada tarea.'
            }
          </p>
          {matrixSize >= 7 && (
            <p className="text-amber-600 font-medium mt-2">
              ⚠️ Matrices grandes pueden tardar más tiempo en procesarse.
            </p>
          )}
          {!isMatrixValid && (
            <p className="text-red-600 font-medium mt-2">
              ❌ Hay valores inválidos en la matriz. Por favor, corrígelos antes de resolver.
            </p>
          )}
        </div>

        <Button
          onClick={onSolve}
          disabled={isCalculating || !isMatrixValid}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          size="lg"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando... {matrixSize >= 7 && '(puede tardar un momento)'}
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Resolver Problema de Asignación
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
