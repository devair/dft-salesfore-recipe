
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
            urlLabel: column.type === 'url' ? urlLabel(record, column) : '',
            isLink: column.type === 'link' ,
            typeAttributes: null,
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