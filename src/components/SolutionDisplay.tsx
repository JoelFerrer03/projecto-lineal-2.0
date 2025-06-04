
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, TrendingDown, ArrowRight, Table, Calculator, Trophy, Target } from 'lucide-react';

interface Assignment {
  resource: number;
  task: number;
  cost: number;
}

interface Solution {
  assignments: Assignment[];
  totalCost: number;
  steps: string[];
  intermediateMatrices?: {
    matrix: number[][];
    description: string;
    selectedCells?: [number, number][];
    operationDetails?: string[];
  }[];
}

interface SolutionDisplayProps {
  solution: Solution;
  originalMatrix: number[][];
  objective: 'minimize' | 'maximize';
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  solution,
  originalMatrix,
  objective
}) => {
  const formatNumber = (value: number) => {
    return Math.round(value).toString();
  };

  // Sort assignments by task number (column) from left to right
  const sortedAssignments = [...solution.assignments].sort((a, b) => a.task - b.task);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Solution Summary - Enhanced Design */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardTitle className="flex items-center gap-3 text-xl relative z-10">
            <div className="p-2 bg-white/20 rounded-full">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="font-bold">Solución Óptima Encontrada</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Total Cost/Benefit Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                {objective === 'minimize' ? (
                  <div className="p-3 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                ) : (
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800">
                  {objective === 'minimize' ? 'Costo Mínimo Total' : 'Beneficio Máximo Total'}
                </h3>
              </div>
              
              <div className="mb-4">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {formatNumber(solution.totalCost)}
                </div>
                <Badge 
                  variant={objective === 'minimize' ? 'destructive' : 'default'} 
                  className="text-sm px-4 py-2 font-semibold"
                >
                  {objective === 'minimize' ? '🎯 Minimizado' : '📈 Maximizado'}
                </Badge>
              </div>
            </div>

            {/* Assignments Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Asignaciones Óptimas</h3>
              </div>
              <div className="space-y-3">
                {sortedAssignments.map((assignment, index) => (
                  <div 
                    key={index}
                    className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-blue-100 hover:border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="font-semibold text-blue-600">
                          Tarea {assignment.task + 1}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-semibold text-emerald-600">
                          Recurso {assignment.resource + 1}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold text-sm px-3 py-1">
                      {formatNumber(assignment.cost)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Matrix with Solution - Enhanced */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-white/20 rounded-full">
              <Table className="h-5 w-5" />
            </div>
            Tabla Final con Asignaciones Óptimas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <th className="border-0 p-4 text-gray-600 font-bold"></th>
                  {originalMatrix[0]?.map((_, colIndex) => (
                    <th key={colIndex} className="border-0 p-4 text-gray-700 font-bold text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>Tarea {colIndex + 1}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {originalMatrix.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="border-0 p-4 bg-gray-100 font-bold text-gray-700">
                      <div className="flex items-center gap-1">
                        <span>Recurso {rowIndex + 1}</span>
                      </div>
                    </td>
                    {row.map((value, colIndex) => {
                      const isAssigned = solution.assignments.some(
                        assignment => assignment.resource === rowIndex && assignment.task === colIndex
                      );
                      
                      return (
                        <td 
                          key={colIndex}
                          className={`border-0 p-4 text-center transition-all duration-200 ${
                            isAssigned 
                              ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 font-bold text-green-800 shadow-inner' 
                              : 'hover:bg-blue-50'
                          }`}
                        >
                          <div className="text-lg font-semibold">
                            {formatNumber(value)}
                          </div>
                          {isAssigned && (
                            <div className="text-xs text-green-600 font-bold mt-1 flex items-center justify-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Asignado
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Intermediate Matrices - Enhanced Section */}
      {solution.intermediateMatrices && solution.intermediateMatrices.length > 0 && (
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-white/20 rounded-full">
                <Calculator className="h-5 w-5" />
              </div>
              Proceso Paso a Paso del Algoritmo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {solution.intermediateMatrices.map((step, stepIndex) => (
                <div key={stepIndex} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {stepIndex + 1}
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 leading-tight">
                      {step.description}
                    </h4>
                  </div>
                  
                  {/* Operation Details Section */}
                  {step.operationDetails && step.operationDetails.length > 0 && (
                    <div className="mb-6 bg-white rounded-lg p-4 border-l-4 border-blue-400 shadow-sm">
                      <h5 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Detalles de las Operaciones:
                      </h5>
                      <div className="space-y-2">
                        {step.operationDetails.map((detail, detailIndex) => (
                          <div key={detailIndex} className={`text-sm ${detail === '' ? 'h-2' : 'text-blue-700 font-mono bg-blue-50 p-2 rounded'}`}>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto bg-white rounded-lg p-4 shadow-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 font-bold text-xs text-gray-600"></th>
                          {step.matrix[0]?.map((_, colIndex) => (
                            <th key={colIndex} className="border border-gray-300 p-3 font-bold text-xs text-gray-700">
                              T{colIndex + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {step.matrix.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td className="border border-gray-300 p-3 bg-gray-100 font-bold text-xs text-gray-700">
                              R{rowIndex + 1}
                            </td>
                            {row.map((value, colIndex) => {
                              const isSelected = step.selectedCells?.some(
                                ([r, c]) => r === rowIndex && c === colIndex
                              );
                              
                              return (
                                <td 
                                  key={colIndex}
                                  className={`border border-gray-300 p-3 text-center text-sm transition-colors ${
                                    isSelected 
                                      ? 'bg-blue-100 border-blue-400 font-bold text-blue-900 shadow-inner' 
                                      : value === 0 
                                        ? 'bg-yellow-50 text-yellow-800 font-semibold'
                                        : 'bg-white hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="font-semibold">
                                    {formatNumber(value)}
                                  </div>
                                  {isSelected && (
                                    <div className="text-xs text-blue-600 mt-1 font-bold">
                                      ● Seleccionado
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Algorithm Steps - Enhanced */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-white/20 rounded-full">
              <CheckCircle className="h-5 w-5" />
            </div>
            Resumen de Pasos del Algoritmo Húngaro
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {solution.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-800 leading-relaxed font-medium">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
