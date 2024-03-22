import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import { mountData } from './customRelatedListHelper';

const columns = [
    {   label: 'Case Number', fieldName: 'CaseNumber', sortable: true },
    {   label: 'Origin', fieldName: 'Origin', sortable: true },
    {   label: 'Created Date', fieldName: 'CreatedDate', type: 'date',  sortable: true,
        typeAttributes: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' } },
];

const actions = [{ 'label': 'View', 'name': 'show_case' }];

const relatedListFields = ['Case.Id', 'Case.CaseNumber', 'Case.Status', 'Case.Origin',
    'Case.CreatedDate', 'Case.ClosedDate'];

export default class CustomRelatedList extends NavigationMixin(LightningElement)  {

    @api recordId;
    objectApiName = 'Case';
    name = 'Cases';

    // The data table data
    data;
    columns = columns;
    count = 0;

    get title() {
        return `${this.name} (${this.count})`;
    }

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Cases',
        fields: relatedListFields,
        sortBy: ['-Case.CreatedDate']
    })
    handleCaseList(result) {
        const { data, error } = result;
        if (data) {
            this.data = mountData(data.records);
            this.error = undefined;
            this.count = data.count;
        }
        else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }


    handleNewButtonClick(event) {
        const defaultValues = encodeDefaultFieldValues({
            AccountId: this.recordId
        });

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Case',
                actionName: 'new'
            },
            state: {
                defaultFieldValues : defaultValues,
                nooverride: '1',
                useRecordTypeCheck: 1
            }
        });
    }

    handleRowAction(event) {
        const row = event.detail.row;
        const action = event.detail.action;

        switch (action.name) {
            case 'show_case':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName,
                        actionName: 'view'
                    }
                });
                break;
        }
    }


    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                return primer(x[field]);
            }
            : function (x) {
                return x[field];
            };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

}