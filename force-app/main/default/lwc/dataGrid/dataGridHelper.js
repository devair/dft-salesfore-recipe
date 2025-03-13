
export const isObject = (value ) => {
    return typeof value === 'object' && value !== null;
}


export const processCellAttributes = (record, column) =>{
    const cellAttributes = column?.cellAttributes;
    let objReturn;
    
    if(cellAttributes){
        // Icon Name
        let iconName = cellAttributes?.iconName;        
        if(iconName && iconName?.fieldName ){   
            iconName = record[iconName.fieldName];
        }

        // Icon Variant
        let iconVariant = cellAttributes?.iconVariant;        
        if(iconVariant && iconVariant?.fieldName){
            iconVariant = record[iconVariant.fieldName];
        }                            
        
        // Icon class
        let iconStyle = cellAttributes?.iconStyle;        
        if(iconStyle && iconStyle?.fieldName ){
            iconStyle = record[iconStyle.fieldName]
        }

        // Icon Position
        const isLeft = cellAttributes?.iconPosition === 'left' ? true : false;
        const isRight = cellAttributes?.iconPosition === 'right' ? true : false;

        let currencyAttributes;        
        if(column.type === 'currency'){
            currencyAttributes = currencyType(cellAttributes, record);
        }
        
        objReturn = { iconName, isLeft, isRight, iconVariant, iconStyle, ... currencyAttributes };        
    }
    

    return objReturn;
}

const currencyType = (attributes, record )=> {
    
    let  currencyCode = attributes.currencyCode;
    currencyCode = currencyCode?.fieldName ?  record[currencyCode.fieldName] : currencyCode;

    return {
        currencyCode,
        currencyDisplayAs: attributes.currencyDisplayAs 
    };
}

export const processTypeAttributes = (record, column) =>{
    const typeAttributes = column?.typeAttributes;
    let objReturn;
    
    if(typeAttributes){
        
        let iconName = typeAttributes?.iconName;        
        if(iconName && iconName?.fieldName){
            iconName = record[typeAttributes.iconName.fieldName];
        }                            
        

        let iconVariant = typeAttributes?.iconVariant;        
        if(iconVariant && iconVariant?.fieldName){
            iconVariant = record[iconVariant.fieldName];
        }    

        let iconClass = typeAttributes?.iconClass;
        if(iconClass && iconClass?.fieldName){
            iconClass = record[iconClass.fieldName];
        }                            
        
        const isLeft = typeAttributes?.iconPosition === 'left' ? true : false;
        const isRight = typeAttributes?.iconPosition === 'right' ? true : false;

        let currencyAttributes;        
        if(column.type === 'currency'){
            currencyAttributes = currencyType(typeAttributes,record);
        }
        
        objReturn = { iconName, 
                isLeft, 
                isRight, 
                iconVariant, 
                ...currencyAttributes,                 
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
        
        const hasDataChildren = record?.children?.data?.length > 0;
        const hasChildren = record.hasChildren || hasDataChildren ? true : false ;

        return {
            ...record,
            cells,                
            expanded: `expanded-${record.id}`,
            hasChildren: hasChildren,
            hasDataChildren: hasDataChildren,
            children: hasDataChildren ? processedChildren(record.children) : undefined,                
            isExpanded: hasChildren && expanded ? true : false,
            icon: 'utility:chevronright'
        };            
    });

    return {
        columns: columns,
        data: data
    }
}