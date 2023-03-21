import { LightningElement,track,api,wire } from 'lwc';
import getAccountList from '@salesforce/apex/leadConversionRelatedRecords.getAccountContactList';
export default class LeadConversionCustomLookup extends LightningElement {
    @track recordsList;  
  @track searchKey = "";  
  @api selectedValue;  
  @api selectedRecordId;  
  @api objectApiName;  
  @api iconName;  
  @api lookupLabel;  
 @api placeholdertext;
  @track message;  
  @api disableSearchResponseFromParent; 
  onLeave(event) {  
   setTimeout(() => {  
    this.searchKey = "";  
    this.recordsList = null;  
   }, 300);  
  }  
    
  onRecordSelection(event) {  
   this.selectedRecordId = event.target.dataset.key;  
   this.selectedValue = event.target.dataset.name;  
   this.searchKey = "";  
   this.onSeletedRecordUpdate();  
  }  
   
  handleKeyChange(event) {  
   const searchKey = event.target.value;  
   this.searchKey = searchKey;  
   this.getLookupResult();  
  }  
   
  removeRecordOnLookup(event) {  
   this.searchKey = "";  
   this.selectedValue = null;  
   this.selectedRecordId = null;  
   this.recordsList = null;  
   this.onSeletedRecordUpdate();  
 }  
  getLookupResult() {  
    getAccountList({ searchKey: this.searchKey, objectName : this.objectApiName })  
    .then((result) => {  
     if (result.length===0) {  
       this.recordsList = [];  
       this.message = "No Records Found";  
      } else {  
       this.recordsList = result;  
       this.message = "";  
      }  
      this.error = undefined;  
    })  
    .catch((error) => {  
     this.error = error;  
     this.recordsList = undefined;  
    });  
  }  
  
  onSeletedRecordUpdate(){  
   const passEventr = new CustomEvent('recordselection', {  
     detail: { selectedRecordId: this.selectedRecordId, selectedValue: this.selectedValue }  
    });  
    this.dispatchEvent(passEventr); 
  } 

  @api recordSelectionValidation(){
    var inputCmp = this.template.querySelector("lightning-input");
    var value = inputCmp.value;
    // is input is valid?
    if (value === "") {
      
      inputCmp.setCustomValidity("Please choose an existing   " +this.objectApiName+  "     or create a new one");
      
    } else {
      inputCmp.setCustomValidity(""); // if there was a custom error before, reset it
    }
    inputCmp.reportValidity(); // Tells lightning-input to show the error right away without needing interaction
  }

  }