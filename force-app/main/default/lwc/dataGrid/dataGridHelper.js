
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
        }

        let iconVariant = cellAttributes?.iconVariant;
        
        if(iconVariant){   
            if(iconVariant?.fieldName){
                iconVariant = record[iconVariant.fieldName];
            }                            
            else{
                iconVariant = iconVariant
            }                                
        }

        const isLeft = cellAttributes?.iconPosition === 'left' ? true : false;
        const isRight = cellAttributes?.iconPosition === 'right' ? true : false;

        
        objReturn = { iconName, isLeft, isRight, iconVariant };        
    }
    

    return objReturn;
}

export const processTypeAttributes = (record, column) =>{
    const typeAttributes = column?.typeAttributes;
    let objReturn;
    
    if(typeAttributes){
        let iconName;
        
        if(typeAttributes?.iconName){   
            if(typeAttributes.iconName?.fieldName){
                iconName = record[typeAttributes.iconName.fieldName];
            }                            
            else{
                iconName = typeAttributes.iconName
            }                                
        }

        let iconVariant = typeAttributes?.iconVariant;
        
        if(iconVariant){   
            if(iconVariant?.fieldName){
                iconVariant = record[iconVariant.fieldName];
            }                            
            else{
                iconVariant = iconVariant
            }                                
        }

        let iconClass = typeAttributes?.iconClass;
        if(iconClass){   
            if(iconClass?.fieldName){
                iconClass = record[iconClass.fieldName];
            }                            
            else{
                iconClass = iconClass
            }                                
        }

        const isLeft = typeAttributes?.iconPosition === 'left' ? true : false;
        const isRight = typeAttributes?.iconPosition === 'right' ? true : false;

        let currencyCode = typeAttributes?.currencyCode;

        let currencyDisplayAs = typeAttributes?.currencyDisplayAs;
        
        objReturn = { iconName, 
                isLeft, 
                isRight, 
                iconVariant, 
                currencyCode, 
                currencyDisplayAs, 
                name: typeAttributes?.name, 
                label: typeAttributes?.label};        
    }
    

    return objReturn;
}

export const findRecord = (records, targetId) => {
    for (const record of records) {
        if (record.id === targetId) {
            return record;
        }
        if (record.children?.data && record.children.data.length > 0) {
            const found = findRecord(record.children.data, targetId);
            if (found) return found;
        }
    }
    return null;
};

const urlLabel = (record, column) => {
    const field = column?.typeAttributes?.label?.fieldName;
    const value = field ? record[field]: '';
    return value;
}

const processedChildren = (children) => {
    return children ? processRecords(children.data, children.columns) : null;
};

export const processRecords = (records, columns, expanded) => {
    const data = records.map(record => {            
        const cells = columns.map((column, index) => ({
            firstField: index === 0,
            fieldName: column.fieldName,
            label: column.label,
            value: record[column.fieldName] || '',
            isDate: column.type === 'date',
            isNumber: column.type === 'number',
            isCurrency: column.type === 'currency',
            isUrl: column.type === 'url',
            isButton: column.type === 'button',
            isButtonIcon: column.type === 'button-icon',
            urlLabel: column.type === 'url' ? urlLabel(record, column) : '',
            isLink: column.type === 'link' ,
            typeAttributes: processTypeAttributes(record, column),
            cellAttributes: processCellAttributes(record, column)
        }));
        
        const hasChildren = record?.children?.data && record?.children?.data.length > 0 ? true : false ;

        return {
            ...record,
            cells,                
            expanded: `expanded-${record.id}`,
            hasChildren: hasChildren,
            children: hasChildren? processedChildren(record.children) : undefined,                
            isExpanded: hasChildren && expanded ? true : false,
            icon: 'utility:chevronright'
        };            
    });

    return {
        columns: columns,
        data: data
    }
}