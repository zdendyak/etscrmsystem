angular.module('etsApp', ['ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui-notification'])
	.config(function($stateProvider, $urlRouterProvider, NotificationProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
		.state("dash", {
			abstract: true,
			templateUrl: "app/partial/dash.html",
			controller: 'DashCtrl'
		})
		.state("auth", {
			//url: "/auth",
			abstract: true,
			templateUrl: "app/partial/auth.html",
		})
		.state("auth.login", {
			url: "/login",
			templateUrl: "app/partial/login.html",
			controller: 'LoginCtrl'
		})
		.state("auth.register", {
			url: "/register",
			templateUrl: "app/partial/register.html",
			controller: 'RegisterCtrl'
		})
		.state("dash.main", {
			url: '/',
			templateUrl: "app/partial/main.html",
			controller: 'MainCtrl'
		})
		.state("dash.clients", {
			url: '/clients',
			templateUrl: "app/partial/clients.html",
			controller: 'ClientsCtrl',
			resolve: {
				clients: ['ClientService', function(ClientService) {
					return ClientService.getAllClients();
				}]
			}
		})
		.state("dash.clientDetail", {
			url: '/client/:id',
			templateUrl: "app/partial/client-detail.html",
			controller: 'ClientDetailCtrl',
			resolve: {
				client: ['$stateParams', 'ClientService', function($stateParams, ClientService) {
					var id = $stateParams.id;
					return ClientService.getClientById(id);
				}]
			}
		})
		.state("dash.addClient", {
			url: '/addclient',
			templateUrl: "app/partial/client-edit.html",
			controller: 'AddClientCtrl'
		})
		.state("dash.editClient", {
			url: '/editclient/:id',
			templateUrl: "app/partial/client-edit.html",
			controller: 'EditClientCtrl',
			resolve: {
				client: ['$stateParams', 'ClientService', function($stateParams, ClientService) {
					var id = $stateParams.id;
					return ClientService.getClientById(id);
				}]
			}
		})
		.state("dash.contacts", {
			url: '/contacts',
			templateUrl: "app/partial/contacts.html",
			controller: 'ContactsCtrl',
			resolve: {
				contacts: ['ContactService', function(ContactService) {
					return ContactService.getAllContacts();
				}]
			}
		})
		.state("dash.offers", {
			url: '/offers',
			templateUrl: "app/partial/offers.html",
			controller: 'OffersCtrl',
			resolve: {
				offers: ['OfferService', function(OfferService) {
					return OfferService.getAllOffers();
				}]
			}
		})
		.state("dash.invoices", {
			url: '/invoices',
			templateUrl: "app/partial/invoices.html",
			controller: 'InvoicesCtrl',
			resolve: {
				invoices: ['InvoiceService', function(InvoiceService) {
					return InvoiceService.getAllInvoices();
				}]
			}
		})
		.state("dash.coworkers", {
			url: '/coworkers',
			templateUrl: "app/partial/coworkers.html",
			controller: 'CoworkersCtrl',
			resolve: {
				coworkers: ['UserService', function(UserService) {
					return UserService.getAllUsers();
				}]
			}
		})
		.state("dash.profile", {
			url: '/profile',
			templateUrl: "app/partial/profile.html",
			controller: 'ProfileCtrl'
		});

		NotificationProvider.setOptions({
			delay: 5000,
			startTop: 10,
			startRight: 10,
			verticalSpacing: 20,
			horizontalSpacing: 20,
			potitionX: 'right',
			positionY: 'top'
		});

	})
	.run(function($rootScope, $state, SessionService) {
		$rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
			if (!SessionService.isAuthenticated()) {
				if (next.name !== 'auth.login' && next.name !== 'auth.register') {
					event.preventDefault();
					$state.go('auth.login');
				};
			};

			if (SessionService.isAuthenticated()) {
				if (next.name === 'auth.login' || next.name === 'auth.register') {
					event.preventDefault();
					if ($state === 'auth.login' || $state === 'auth.register') {
						$state.go('dash.main');
					};
				};
			};
		});
	});