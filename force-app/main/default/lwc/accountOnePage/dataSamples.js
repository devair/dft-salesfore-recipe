
export function itensPedido() {
    return [
        {            
            id: 1,
            produto: 'PRODUTO 1',
            quantidade: 1200,
            qtdFaturada: 1200,
            qtdDisponivel: 0,
            entrega: '2025-12-31',
            valor: 7500,
            pagamento: '15 DDL',
            status: 'Faturado',
            children: [
                { 
                    id: 2,
                    numero: '000000001-001',
                    emissao: '2025-02-13',
                    valor: 2500
                },
                { 
                    id: 3,
                    numero: '000000002-001',
                    emissao: '2025-02-13',
                    valor: 2500
                },
                { 
                    id: 4,
                    numero: '000000004-001',
                    emissao: '2025-02-13',
                    valor: 2500
                },
            ]           
        },
        {                                            
            id: 5,
            produto: 'PRODUTO 2',
            quantidade: 2000,
            qtdFaturada: 1500,
            qtdDisponivel: 500,
            entrega: '2025-12-31',
            valor: 1000,
            pagamento: '15 DDL',
            status: 'Faturado parcial',
            children: [
                { 
                    id: 6,
                    numero: '000000003-001',
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    id: 7,
                    numero: '000000004-001',
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    id: 8,
                    numero: '000000005-001',
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    id: 9,
                    numero: '000000006-001',
                    emissao: '2025-01-13',
                    valor: 1000
                }
            ]  
        }
    ];
}

export function colunasItem(){
    return [
            {label: 'Produto', fieldName: 'produto', type: 'text'},
            {label: 'Quantidade', fieldName: 'quantidade', type: 'number'},
            {label: 'Qtd. Faturada', fieldName: 'qtdFaturada', type: 'number'},
            {label: 'Qtd. Disponível', fieldName: 'qtdDisponivel', type: 'number'},
            {label: 'Entrega', fieldName: 'entrega', type: 'date'},
            {label: 'Valor', fieldName: 'valor', type: 'currency'},
            {label: 'Pagamento', fieldName: 'pagamento', type: 'text'},
            {label: 'Status', fieldName: 'status', type: 'text'}     
    ];    
}

export function colunasItemMae(){
    return [
            {label: 'Produto', fieldName: 'produto', type: 'text'},
            {label: 'Quantidade', fieldName: 'quantidade', type: 'number'},
            {label: 'Qtd. Desmembrada', fieldName: 'qtdDesmembrada', type: 'number'},
            {label: 'Saldo a Desmembrar', fieldName: 'saldoDesmembrar', type: 'number'},
            {label: 'Cadencia Entrega', fieldName: 'cadenciaEntrada', type: 'text'},
            {label: 'Valor', fieldName: 'valor', type: 'currency'},            
            {label: 'Status', fieldName: 'status', type: 'text'}     
    ];    
}


export function colunasNota(){
    return [                
        {label: 'Número', fieldName: 'numero', type: 'text'},
        {label: 'Emissão', fieldName: 'emissao', type: 'date'},
        {label: 'Valor', fieldName: 'valor', type: 'currency'}     
    ];
   
}

export function colunasPedido(){
    return [
        {label: 'Pedido', fieldName: 'numero', type: 'text'},        
        {label: 'Tipo de Pedido', fieldName: 'tipo', type: 'text'},        
        {label: 'Tipo de Pgto', fieldName: 'tipo', type: 'text'},        
        {label: 'Valor', fieldName: 'valor', type: 'currency'},        
        {label: 'Pagamento', fieldName: 'pagamento', type: 'text'},        
        {label: 'Status', fieldName: 'status', type: 'text'},        
    ]
}

export function colunasPedidoMae(){
    return [
        {label: 'Pedido', fieldName: 'numero', type: 'text'},        
        {label: 'Tipo de Pedido', fieldName: 'tipo', type: 'text'},        
        {label: 'Tipo de Pgto', fieldName: 'tipo', type: 'text'},        
        {label: 'Valor', fieldName: 'valor', type: 'currency'},        
        {label: 'Pagamento', fieldName: 'pagamento', type: 'text'},        
        {label: 'Status', fieldName: 'status', type: 'text'},        
    ]
}


export function pedidos() {
    return [...pedidosMae(),        
        {                        
            id: 1,            
            numero: '123',            
            valor: 7500,        
            tipo: 'Normal',
            tipoPgto: 'Cash',
            pagamento: '30 DDL',
            status: 'Aprovado',
            children : { 
                columns: colunasItem(),
                data: itensPedido()            
            }
        }        
    ];
}

export function pedidosFilho() {
    return [
        {                        
            id: 1,            
            numero: '123',
            emissao: '2025-12-31',
            valor: 7500,            
            tipo: 'Filho',
            children : itensPedido(),            
        },
        {                        
            id: 2,            
            numero: '3333',
            emissao: '2025-12-31',
            tipo: 'Filho',
            valor: 75000,            
            children : itensPedido()
        }
    ];
}

export function pedidosMae() {
    return [
        {
            id: 100,            
            numero: '0123',            
            valor: 7500,            
            tipo: 'Mae',
            tipoPgto: 'Cash',
            pagamento: '30 DDL',
            status: 'Aprovado',            
            children : { 
                columns: colunasItemMae(),
                data: itensPedidoMae()            
            }           
        }
    ]
}

export function itensPedidoMae(){
    return [
        {            
            id: 110,
            produto: 'PRODUTO 3',
            quantidade: 1200,
            qtdDesmembrada: 0,
            saldoDesmembrar: 0,
            cadenciaEntrada: '12/08/2024 - 12/09/2024',
            valor: 7500,            
            status: 'Pendente',
            children: []            
        }
    ];
}
