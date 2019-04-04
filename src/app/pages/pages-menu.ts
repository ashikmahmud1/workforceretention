import {NbMenuItem} from '@nebular/theme';

// @ts-ignore
// @ts-ignore
// @ts-ignore
export const MENU_ITEMS: NbMenuItem[] =
    [
        {
            title: 'Products',
            icon: 'nb-lightbulb',
            children: [
                {
                    title: 'Product Management',
                    link: 'products/product-management',
                },
                {
                    title: 'Static Pages',
                    link: 'products/static-pages',
                },
                {
                    title: 'Box Management',
                    link: 'products/box-management',
                }
            ],
        },
        {
            title: 'Articles',
            icon: 'nb-compose',
            children: [
                {
                    title: 'Articles Management',
                    link: 'articles/article-management',
                },
            ],
        },
        {
            title: 'Clients',
            icon: 'nb-person',
            children: [
                {
                    title: 'Client Selection',
                    link: 'clients/client-selection'
                },
            ],
        },
        {
            title: 'Surveys',
            icon: 'nb-e-commerce',
            children: [
                {
                    title: 'Survey Management',
                    link: 'surveys/survey-management',
                },
                // {
                //     title: 'Email Management',
                //     link: 'surveys/email-management',
                // },
            ],
        },
        {
            title: 'Reporting',
            icon: 'nb-bar-chart',
            children: [
                {
                    title: 'Data Reports',
                    link: 'reporting/data-reports',
                },
                {
                    title: 'Report Files',
                    link: 'reporting/report-files',
                },
            ],
        },
        {
            title: 'Links',
            icon: 'nb-shuffle',
            children: [
                {
                    title: 'Link Management',
                    link: 'links/link-management',
                },
                {
                    title: 'Category Management',
                    link: 'links/category-management',
                },
            ],
        },
        {
            title: 'Office Admin',
            icon: 'nb-power-circled',
            children: [
                {
                    title: 'User Management',
                    link: 'office-admin/employee-management',
                },
                {
                    title: 'Permission Management',
                    link: 'office-admin/permission-management',
                },
                {
                    title: 'Email Management',
                    link: 'office-admin/email-management'
                }
            ],
        }
    ];
