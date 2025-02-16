
export function itensPedido() {
    return [
        {
            isExpanded : false,
            expanded: `expanded-1`,
            icon: 'utility:chevronright',
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
            isExpanded : false,
            expanded: `expanded-5`,
            icon: 'utility:chevronright',   
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

export function colunasNota(){
    return [                
        {label: 'Número', fieldName: 'numero', type: 'text'},
        {label: 'Emissão', fieldName: 'emissao', type: 'date'},
        {label: 'Valor', fieldName: 'valor', type: 'currency'}     
    ];
   
}

export function colunasPedido(){
    return [
        {label: 'Número', fieldName: 'numero', type: 'text'},
        {label: 'Emissão', fieldName: 'emissao', type: 'date'},
        {label: 'Valor', fieldName: 'valor', type: 'currency'},        
    ]
}


export function pedidos() {
    return [
        {                        
            id: 1,            
            numero: '123',
            emissao: '2025-12-31',
            valor: 7500,            
            children : itensPedido(),            
        },
        {                        
            id: 2,            
            numero: '3333',
            emissao: '2025-12-31',
            valor: 75000,            
            children : itensPedido()
        }
    ];
}
