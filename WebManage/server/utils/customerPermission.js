var permissionMappings = {};

permissionMappings.defineSideBar = async (valueService) => {
    const permissions = valueService.split(',')
    let temp = permissions.map(item => item.split('/')[1]);
    temp.sort();
    let latch = 0;
    let result = [];
    temp.map(id => {
        if(id>latch) {
            let floor = Math.floor(id/10) * 10;
            latch = floor + 9;
            result.push(id);
        }
    })
    return result;
}

module.exports = permissionMappings;