//import React from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import type { Filter, Query } from '@cubejs-client/core';
import '../App.css';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

//qual o faturamento total do mes? 

const QUERY_FATURAMENTO_MES: Query = {
    measures: ['sales.faturamento'],
    timeDimensions: [{
        dimension: 'sales.created_at',
        granularity: 'month',
        dateRange: 'this month'
    }]
};

//qual o top 10 produtos mais vendidos no delivery? 

const FILTRO_DELIVERY: Filter[] = [{
    member: 'channels.tipo',
    operator: 'equals',
    values: ['D']
}]

const QUERY_TOP_10_DELIVERY: Query = {
    measures: ['product_sales.quantidade_vendida'], //medicao 
    dimensions: ['products.nome'], //agrupamento
    order: { 'product_sales.quantidade_vendida': 'desc' }, //ordenacao
    limit: 10, //top 10
    filters: FILTRO_DELIVERY //filtro 
}

type KpiCardProps = {
    titulo: string;
    valor: string;
    isLoading: boolean;
}

function KpiCard({ titulo, valor, isLoading }: KpiCardProps) {
    return (
        <div className="kpi-card">
            <h2>{titulo}</h2>
            {isLoading ? (
                <h3>Carregando...</h3>
            ) : (
                <h1 className="kpi-valor">{valor}</h1>
            )}
        </div>
    );
}

function Top10Chart() {
    const { resultSet, isLoading, error } = useCubeQuery(QUERY_TOP_10_DELIVERY);

    if (isLoading) return <div>Carregando top 10...</div>
    if (error) return <div>{error.message}</div>
    if (!resultSet) return null;

    return (
        <div className="chart-container" style={{ marginTop: '24px' }}>
            <h2>Top 10 Produtos (Delivery)</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={resultSet.chartPivot()}
                    layout="vertical" // orientacao do grafico
                    margin={{ left: 100 }} 
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" /> {/* eixo x = numeros */}
                    <YAxis type="category" dataKey="x" interval={0} /> {/* eixo y = nomes */}
                    <Tooltip formatter={(value: number) => [value, 'Qtd. Vendida']} />
                    <Legend />
                    <Bar dataKey="product_sales.quantidade_vendida" fill="#4C51BF" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function Home() {

    const { resultSet: kpiResultSet, isLoading: kpiLoading, error: kpiError } = useCubeQuery(QUERY_FATURAMENTO_MES);

    let faturamentoFormatado = "R$ 0,00";
    if (kpiResultSet) {

        const valor = kpiResultSet.totalRow()['sales.faturamento'];
        faturamentoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    }

    if (kpiError) {
        return <div>{kpiError.message}</div>
    }

    return (
        <div>
            <h1>Dashboard Geral</h1>
            <p>Visão simplificada dos indicadores mais importantes.</p>

            <div className="kpi-container">
                <KpiCard
                    titulo="Faturamento (Este Mês)"
                    valor={faturamentoFormatado}
                    isLoading={kpiLoading}
                />
                {/* outros cards */}
            </div>
            <Top10Chart />
        </div>
    );
}

export default Home;