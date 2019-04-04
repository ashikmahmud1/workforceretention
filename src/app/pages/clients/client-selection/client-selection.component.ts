import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ClientService} from "../../../@core/data/client.service";
import {NbMenuService} from "@nebular/theme";

@Component({
    selector: 'ngx-client-selection',
    templateUrl: './client-selection.component.html',
    styleUrls: ['./client-selection.component.scss'],
})
export class ClientSelectionComponent implements OnInit {
    rows = [];
    count = 0;
    offset = 0;
    limit = 10;
    clients;
    products = [
        {id: 1, name: 'Exit Interview'},
    ];
    workforces = [
        {id: 0, value: 'Less than 100'},
        {id: 1, value: '100 - 249'},
        {id: 2, value: '250 - 499'},
        {id: 3, value: '500 - 999'},
        {id: 4, value: '1,000 - 4,999'},
        {id: 5, value: '5,000 +'}
    ];

    // Table Column Client Name, Client Industry, Client Employees, Products

    constructor(private clientService: ClientService, private router: Router, private menuService: NbMenuService) {
    }

    onClickAdd() {
        this.router.navigateByUrl('/pages/clients/client-selection/add');
    }

    ngOnInit() {
        this.page(this.offset, this.limit);
    }

    /**
     * Populate the table with new data based on the staticPage number
     * @param staticPage The staticPage to select
     */
    onPage(event) {
        this.page(event.offset, event.limit);
    }

    onClickEdit(id) {
        this.router.navigateByUrl('/pages/clients/client-selection/edit/' + id);
    }

    onClickDelete(id) {
        //find the employee name from the rows using
        const client = this.rows.find(x => x.id === id);
        const name = client.name;
        if (client.employees.length > 0) {
            if (confirm("There are employees assigned to this Client, are you sure you want to delete ? " + name)) {
                this.deleteClient(id);
            }
        } else {
            if (confirm("Are you sure to delete " + name)) {
                this.deleteClient(id);
            }
        }

    }

    deleteClient(id) {
        this.clientService.deleteClient(id).subscribe(
            data => {
                console.log(data);
                this.page(this.offset, this.limit);
            },
            err => {
                console.log(err);
            }
        );
    }

    page(offset, limit) {
        this.clientService.getClients(offset, limit).subscribe(data => {
                this.count = data.totalItems;
                this.clients = data.clients;
                const rows = [];
                this.clients.map((client) => {
                    console.log(client);
                    // Modify staticPage role
                    client.id = client._id;
                    console.log(client.industry !== null);
                    client.industryName = typeof client.industry === 'undefined' || client.industry == null ?
                        '' : client.industry.name;
                    client.product = this.products.find(p => p.id === client.product).name;
                    client.workforce = this.workforces.find(w => w.id === client.workforce).value;
                    rows.push(client);
                });
                this.rows = rows;
                console.log(this.clients);
            },
            (err) => {
                console.log(err);
            }
        );
    }

}
