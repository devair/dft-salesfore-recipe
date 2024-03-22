
export function mountData(data) {
    const result = data.map((elem) => {
        const item = {
            Id: elem.fields.Id.value,
            CaseUrl: `/lightning/r/${elem.fields.Id.value}/view`,
            CaseNumber: elem.fields.CaseNumber.value,
            Status: elem.fields.Status.value,
            Origin: elem.fields.Origin.value,
            CreatedDate: elem.fields.CreatedDate.value,
            ClosedDate: elem.fields.ClosedDate.value
        };
        console.log(JSON.stringify(item));
        return item;
    }
    );
    return result;
}