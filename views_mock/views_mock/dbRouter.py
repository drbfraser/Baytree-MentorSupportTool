class DBRouter:
    """
    Routes queries to the appropriate db
    """

    route_app_labels = {'users', 'sessions'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'baytree'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return 'baytree'
        return None