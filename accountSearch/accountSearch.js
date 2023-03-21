import {LightningElement,wire} from  'lwc';
import getAccounts from '@salesforce/apex/AccountSearchCls.getAccounts';
const table_columns=[
    {lable:'Name',fieldName: 'Name',type: 'text'},
];
export default class AccountSearch extends LightningElement{
    columns=table_columns;
    @wire(getAccounts) accounts;
}