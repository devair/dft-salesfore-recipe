
export const isObject = (value ) => {
    return typeof value === 'object' && value !== null;
}


export const processCellAttributes = (record, column) =>{
    const cellAttributes = column?.cellAttributes;
    let objReturn;
    
    if(cellAttributes){
        let iconName;
        
        if(cellAttributes?.iconName){   
            if(cellAttributes.iconName?.fieldName){
                iconName = record[cellAttributes.iconName.fieldName];
            }                            
            else{
                iconName = cellAttributes.iconName
            }                    
            console.debug('iconName', iconName);
        }

        let iconVariant = cellAttributes?.iconVariant;
        
        if(cellAttributes?.iconVariant){   
            if(cellAttributes?.iconVariant?.fieldName){
                iconVariant = record[cellAttributes.iconVariant.fieldName];
            }                            
            else{
                iconVariant = cellAttributes.iconVariant
            }                    
            console.debug('iconVariant', iconVariant);
        }

        const isLeft = cellAttributes?.iconPosition === 'left' ? true : false;
        const isRight = cellAttributes?.iconPosition === 'right' ? true : false;

        
        objReturn = { iconName, isLeft, isRight, iconVariant };        
    }
    

    return objReturn;
}
