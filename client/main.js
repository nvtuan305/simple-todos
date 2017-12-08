import angular from 'angular';
import angularMeteor from 'angular-meteor';
import todosList from '../imports/components/todosList/todosList';
import '../imports/startup/accounts-config'

angular.module('todo-app', [
    angularMeteor,
    todosList.name,
    'accounts.ui'
]);