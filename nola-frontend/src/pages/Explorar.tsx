
// importa as ferramentas
import { useState } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import type { Query, Filter } from '@cubejs-client/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CSVLink } from 'react-csv'; 
import '../App.css';
 

function Explorar() {
  //  localhost:4000 --> faz a pergunta -->  resposta.
  //estados para as escolhas de maria (medida e dimensão)
  
  const [medida, setMedida] = useState('sales.faturamento');
  const [dimensao, setDimensao] = useState('channels.nome');

  const [filtroCanal, setFiltroCanal] = useState('todos'); 

  const filtros : Filter[] = [];
  if(filtroCanal !== 'todos') {
    filtros.push({
      member: 'channels.nome', // dimensao que ira acontecer o filtro
      operator: 'equals', // a operacao 
      values: [filtroCanal] // valor do filtro <select>
    });
  }

  const queryDaMaria: Query = {
    measures: [medida], 
    dimensions: [dimensao], 
    order: {
      [medida]: 'desc'
    },
    filters: filtros,
  };
  //hook do useCubeQuery
  const { resultSet, isLoading, error } = useCubeQuery(queryDaMaria);

  const { resultSet: canais } = useCubeQuery({
    dimensions: ['channels.nome'],
  });

  // carregando
  if (isLoading) {
    return <div>Carregando os dados...</div>;
  }

  // tratamento de erro
  if (error) {
    return <div>Erro ao carregar: {error.message}</div>;
  }

  // pagina abre
  if (!resultSet) {
    return <div>Sem dados.</div>;
  }

  // grafico (renderiza os dados)
 return (
    <div className="dashboard-container">
      <h1>Dashboard - Maria</h1>

      {/* menu de selecao */}
      <div className="controls-container">
        <label>
          Ver Métrica:
          <select value={medida} onChange={(e) => setMedida(e.target.value)}>
            <option value="sales.faturamento">Faturamento</option>
            <option value="sales.total_de_vendas">Total de Vendas</option>
            <option value="sales.ticket_medio">Ticket Médio</option>
            <option value="product_sales.quantidade_vendida">Qtd. Produtos Vendidos</option>
          </select>
        </label>

        <label>
          Agrupado por:
          <select value={dimensao} onChange={(e) => setDimensao(e.target.value)}>
            <option value="channels.nome">Canal</option>
            <option value="stores.nome">Loja</option>
            <option value="stores.cidade">Cidade</option>
            <option value="products.nome">Nome do Produto</option>
            <option value="sales.dia_da_semana">Dia da Semana</option>
            <option value="sales.hora_do_dia">Hora do Dia</option>
          </select>
        </label>
        
        {/* dropdwon de filtro */}
        <label>
          Filtrar por Canal:
          <select value={filtroCanal} onChange={(e) => setFiltroCanal(e.target.value)}>
            <option value="todos">Todos os Canais</option>
            {/* popula o dropdown */}
            {canais?.rawData().map((canal) => (
              <option key={canal['channels.nome'] as string} value={canal['channels.nome'] as string}>
                {canal['channels.nome']}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="export-container">
        <CSVLink
          data={resultSet.rawData()} //cube.js lida com os dados
          filename="relatorio-maria.csv"
          className="export-button"
        >
          Exportar para Excel (CSV)
        </CSVLink>
      </div>

      {/* o grafico */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={resultSet.chartPivot()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" interval={0} />
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
      </div>
    </div>
  );
}

export default Explorar;