import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks';

import template from './todosList.html';

class TodosListCtrl {

    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('tasks');

        this.helpers({
            currentUser() {
                return Meteor.user();
            },

            tasks() {
                return Tasks.find({
                    checked: { $ne: true }
                }, 
                {
                    sort: { createdDate: -1 }
                });
            }
        })
    }

    addTask(newTask) {
        Meteor.call('tasks.insert', newTask);
        this.newTask = '';
    }

    removeTask(task) {
        Meteor.call('tasks.remove', task._id);
    }

    setChecked(task) {
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }

    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}

export default angular.module('todosList', [angularMeteor])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: ['$scope', TodosListCtrl]
    });