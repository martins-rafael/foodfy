function paginate(selectedPage, totalPages) {
    let pages = [], oldPage;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesAfterSelectedPAge = currentPage <= selectedPage + 2;
        const pagesBeforeSelectedPAge = currentPage >= selectedPage - 2;

        if (firstAndLastPage || pagesAfterSelectedPAge && pagesBeforeSelectedPAge) {
            if (oldPage && currentPage - oldPage > 2) pages.push('...');
            if (oldPage && currentPage - oldPage == 2) pages.push(oldPage + 1);

            pages.push(currentPage);
            oldPage = currentPage;
        }
    }

    return pages;
}

function createPagination(pagination) {
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const search = pagination.dataset.filter;
    const pages = paginate(page, total);
    let elements = '';

    pages.forEach(page => {
        if (String(page).includes('...')) {
            elements += `<span>${page}</span>`;
        } else {
            if (search) {
                elements += `<a href="?page=${page}&search=${search}">${page}</a>`;
            } else {
                elements += `<a href="?page=${page}">${page}</a>`;
            }
        }
    });

    pagination.innerHTML = elements;
    activePage(page);
}

function activePage(page) {
    const pagesOfPagination = document.querySelectorAll('.pagination a');
    pagesOfPagination.forEach(currentPage => {
        if (Number(currentPage.innerHTML) == page) currentPage.classList.add('active');
    });
}

const pagination = document.querySelector('.pagination');
if (pagination) createPagination(pagination);