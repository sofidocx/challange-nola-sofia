import { useState } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import type { Query, Filter } from '@cubejs-client/core';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../App.css';

//qual a performance da Loja A vs a Loja B? 
function CompararLojas() {
    const [medida, setMedida ] = useState('sales.faturamento'); 
    const [lojaA, setLojaA] = useState(''); 
    const[lojaB, setLojaB] = useState(''); 

    //hook para buscar lista de lojas 

    const { 
    resultSet: lojas, 
    isLoading: lojasLoading, 
    error: lojasError 
} = useCubeQuery ({
    dimensions: ['stores.nome'], 
    order: {'stores.nome': 'asc'}
});

    //filtro da query principal 
    const filtros: Filter[] = []; 
    if(lojaA && lojaB) {
        filtros.push({
            member: 'stores.nome', 
            operator: 'in', // esteja em 
            values: [lojaA, lojaB] //seleciona os dois valores, no caso, as duas lojas
        } as unknown as Filter); 
    }

    ///query principal 

    const queryComparacao: Query = {
        measures: [medida], 
        dimensions: ['stores.nome'], 
        filters: filtros, 
    }; 

    //hook da query principal (o desenho do grafico)

    const { 
    resultSet: comparacaoResultSet, 
    isLoading: ComparacaoLoading, 
    error: ComparacaoError      
} = useCubeQuery(queryComparacao, {
    skip: !lojaA || !lojaB
});

    if (lojasError) return <div>Erro ao carregar lista de lojas: {lojasError.message}</div>
    if (lojasLoading) {return <div>Carregando lista de lojas...</div>;}
    if (ComparacaoError) return <div>Erro ao carregar comparação: {ComparacaoError.message}</div>

    return (
    <div>
      <h1>Comparador de Lojas</h1>
      <p>Selecione uma métrica e duas lojas para comparar a performance lado a lado.</p>

      {/* menu de selecao */}
      <div className="controls-container">
        <label>
          Ver Métrica:
          <select value={medida} onChange={(e) => setMedida(e.target.value)}>
            <option value="sales.faturamento">Faturamento</option>
            <option value="sales.total_de_vendas">Total de Vendas</option>
            <option value="sales.ticket_medio">Ticket Médio</option>
          </select>
        </label>

        <label>
          Comparar Loja A:
          <select value={lojaA} onChange={(e) => setLojaA(e.target.value)}>
            <option value="">-- Selecione a Loja A --</option>
            {lojas?.rawData().map((loja) => (
              <option key={loja['stores.nome'] as string} value={loja['stores.nome'] as string}>
                {loja['stores.nome']}
              </option>
            ))}
          </select>
        </label>

        <label>
          Com a Loja B:
          <select value={lojaB} onChange={(e) => setLojaB(e.target.value)}>
            <option value="">-- Selecione a Loja B --</option>
            {lojas?.rawData().map((loja) => (
              <option key={loja['stores.nome'] as string} value={loja['stores.nome'] as string}>
                {loja['stores.nome']}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* o grafico - so aparece quando tiver dados */}
      <div className="chart-container">
        {ComparacaoLoading && <div>Carregando comparação...</div>}

        {/* pagina de dados, se nada selecionado */}
        {!ComparacaoLoading && comparacaoResultSet && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparacaoResultSet.chartPivot()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value)
                }
              />
              <Legend />
              <Bar dataKey={medida} fill="#4C51BF" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* se nao tiver selecionado a loja */}
        {!ComparacaoLoading && (!lojaA || !lojaB) && (
          <div style={{ textAlign: 'center', paddingTop: '50px', color: '#777' }}>
            <h3>Por favor, selecione as duas lojas para comparar.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompararLojas; 