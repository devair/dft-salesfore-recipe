import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    columns = [
        { label: 'Nome', fieldName: 'name', type: 'text' },
        { label: 'Data de Ingresso', fieldName: 'joinedDate', type: 'date' },
        { label: 'Salário', fieldName: 'salary', type: 'currency', currencyCode: 'BRL' },
        { label: 'Perfil', fieldName: 'profileLink', type: 'link', label: 'Ver Perfil' },
        { label: 'Ação Personalizada', fieldName: '', type: 'button', label: 'Detalhes' }
    ];

    records = [
        {
            id: '1',
            name: 'João Silva',
            joinedDate: '2024-01-10T12:00:00Z',
            salary: 5000.25,
            profileLink: 'https://example.com/perfil/joao',
            children: [
                {
                    id: '1-1',
                    name: 'Maria Souza',
                    joinedDate: '2024-03-05T09:00:00Z',
                    salary: 3500.75,
                    profileLink: 'https://example.com/perfil/maria',
                    children: [
                        { id: '1-1-1', name: 'Pedro Santos', joinedDate: '2024-05-01T08:30:00Z', salary: 2000.50, profileLink: 'https://example.com/perfil/pedro' }
                    ]
                }
            ]
        },
        {
            id: '2',
            name: 'Ana Costa',
            joinedDate: '2023-11-15T14:30:00Z',
            salary: 8000.00,
            profileLink: 'https://example.com/perfil/ana'
        }
    ];

    handleCustomAction(event) {
        console.log('Ação personalizada para:', event.detail);
    }
}
