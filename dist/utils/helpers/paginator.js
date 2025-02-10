"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationInfo = void 0;
const getPaginationInfo = (query) => {
    const { page, itemsPerPage } = query;
    console.log(page, typeof page);
    console.log(itemsPerPage, typeof itemsPerPage);
    let paginator;
    if (page && itemsPerPage) {
        paginator = { take: parseInt(itemsPerPage.toString(), 10), skip: (parseInt(page.toString()) - 1) * itemsPerPage };
    }
    return paginator;
};
exports.getPaginationInfo = getPaginationInfo;
//# sourceMappingURL=paginator.js.map