import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

function checkAuthentication() {
    if(Meteor.isClient) {
        console.log('Called in CLIENT side');
    } else if(Meteor.isServer) {
        console.log('Called in SERVER side');
    }

    if(!Meteor.userId()) {
        throw new Meteor.Error('WTF. Login first man');
    }
}

if(Meteor.isServer) {
    Meteor.publish('tasks', () => {
        return Tasks.find({
            $or: [
            {
                private: { $ne: true }
            },
            { 
                owner: Meteor.userId()
            }
        ]});
    });
}

Meteor.methods({

    'tasks.insert' (newTask) {
        check(newTask, String);
        checkAuthentication();

        Tasks.insert({
            text: newTask,
            createdDate: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            private: true
        });
    },

    'tasks.remove' (taskId) {
        check(taskId, String);
        checkAuthentication();

        Tasks.remove(taskId);
    },

    'tasks.setChecked' (taskId, checked) {
        check(taskId, String);
        check(checked, Boolean);
        checkAuthentication();

        Tasks.update(taskId, {
            $set: {
                checked: checked
            }
        })
    },

    'tasks.setPrivate' (taskId, private) {
        check(taskId, String);
        check(private, Boolean);
        checkAuthentication();

        const task = Tasks.findOne(taskId);

        if(!task) {
            throw new Meteor.Error('The task is not existed');
        }

        if(task.owner !== Meteor.userId()) {
            throw new Meteor.Error('You do not have permission to update this task');
        }

        Tasks.update(taskId, {
            $set: { private: private }
        });
    }
});