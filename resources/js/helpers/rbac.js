export const filterMenuByRole = (menu, role) => {

    return menu
        .filter(item => item.roles.includes(role))
        .map(item => {

            if (!item.children) return item;

            return {
                ...item,
                children: item.children.filter(child =>
                    child.roles.includes(role)
                )
            };

        });

};