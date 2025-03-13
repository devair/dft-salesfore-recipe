import { LightningElement, track, api } from 'lwc';

export default class SearchField extends LightningElement {
    @track searchValue = '';
    @track showSuggestionsList = false;

    // Lista de sugestões (poderia vir de um API)
    @api items = [];

    get filteredItems() {
        const query = this.searchValue.toLowerCase();
        return query ? this.items.filter(item => item.value.toLowerCase().includes(query)) : [];
    }

    searchTimeout;
    handleInput(event) {

        // Limpando o timeout anterior se o usuário continuar digitando
        clearTimeout(this.searchTimeout);

        // Aplicando debounce de 500ms
        this.searchTimeout = setTimeout(async () => {
            this.searchValue = event.detail.value;
            this.showSuggestions();        
        }, 50);
        
    }

    handleSelect(event) {
        const value = event.currentTarget.dataset.value;
        const id = event.currentTarget.dataset.id;
        this.searchValue = value;
        this.showSuggestionsList = false;

        const selectedValue = new CustomEvent('select', {
            detail: { value, id}
        });
        this.dispatchEvent(selectedValue);
    }

    clearInput() {
        this.searchValue = '';
        this.showSuggestionsList = false;
    }

    showSuggestions() {
        this.showSuggestionsList = this.filteredItems.length > 0;
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    connectedCallback() {
        document.addEventListener('click', () => {
            this.showSuggestionsList = false;
        });
    }

    disconnectedCallback() {
        document.removeEventListener('click', () => {
            this.showSuggestionsList = false;
        });
    }
}