export function object_array_to_string_array(object_array: any[], key: string): any[] {
    var res: any = [];
    object_array.forEach(function(object: any) {
        res.push(object[key]);
    });
    return res;
};