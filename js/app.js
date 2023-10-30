var app = angular.module("myApp", []);

app.service("DataService", function () {
  var STORAGE_KEY = "myAppData";

  this.getData = function () {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultData();
  };

  this.saveData = function (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  function getDefaultData() {
    return [
      {
        name: "Frontend",
        checked: false,
        children: [
          {
            name: "Web",
            checked: false,
            children: [
              {
                name: "Angular",
                checked: false,
              },
              { name: "Git", checked: false },
            ],
          },
        ],
      },
    ];
  }
});

app.controller("MyController", function ($scope, DataService) {
  $scope.parents = DataService.getData();
  $scope.selectedTable = null;

  $scope.$watch(
    "parents",
    function (newVal) {
      DataService.saveData(newVal);
    },
    true
  );

  function setCheckedRecursive(item, checked) {
    item.checked = checked;
    if (item.children) {
      item.children.forEach(function (child) {
        setCheckedRecursive(child, checked);
      });
    }
  }

  $scope.editParent = function (parent) {
    parent.editing = true;
    parent.editedName = parent.name;
  };

  $scope.saveParent = function (parent) {
    parent.name = parent.editedName;
    parent.editing = false;
    DataService.saveData($scope.parents);
  };

  $scope.deleteParent = function (parent) {
    var index = $scope.parents.indexOf(parent);
    if (index !== -1) {
      $scope.parents.splice(index, 1);
      DataService.saveData($scope.parents);
    }
  };

  $scope.addNewChild = function (parent) {
    var newChild = {
      name: "New Child",
      checked: parent.checked,
      children: [],
    };
    parent.children.push(newChild);
    setCheckedRecursive(newChild, newChild.checked);
    DataService.saveData($scope.parents);
  };

  $scope.addNewSubChild = function (child) {
    var newSubChild = {
      name: "New Sub-Child",
      checked: child.checked,
    };
    child.children.push(newSubChild);
    DataService.saveData($scope.parents);
  };

  $scope.editChild = function (child) {
    child.editing = true;
    child.editedName = child.name;
  };

  $scope.saveChild = function (child) {
    child.name = child.editedName;
    child.editing = false;
    DataService.saveData($scope.parents);
  };

  $scope.deleteChild = function (parent, child) {
    var index = parent.children.indexOf(child);
    if (index !== -1) {
      parent.children.splice(index, 1);
      DataService.saveData($scope.parents);
    }
  };

  $scope.editSubChild = function (subChild) {
    subChild.editing = true;
    subChild.editedName = subChild.name;
  };

  $scope.saveSubChild = function (subChild) {
    subChild.name = subChild.editedName;
    subChild.editing = false;
    DataService.saveData($scope.parents);
  };

  $scope.deleteSubChild = function (child, subChild) {
    var index = child.children.indexOf(subChild);
    if (index !== -1) {
      child.children.splice(index, 1);
      DataService.saveData($scope.parents);
    }
  };

  $scope.checkChildren = function (parent) {
    function setCheckedRecursive(items, checked) {
      angular.forEach(items, function (item) {
        item.checked = checked;
        if (item.children) {
          setCheckedRecursive(item.children, checked);
        }
      });
    }

    setCheckedRecursive(parent.children, parent.checked);
  };

  $scope.checkParent = function (parent, child) {
    var allChecked = true;
    angular.forEach(child.children, function (subChild) {
      subChild.checked = child.checked;
      setCheckedRecursive(subChild, child.checked);
    });

    angular.forEach(parent.children, function (child) {
      if (!child.checked) {
        allChecked = false;
      }
    });

    parent.checked = allChecked;
    setCheckedRecursive(parent, allChecked);
  };

  angular.forEach($scope.parents, function (parent) {
    angular.forEach(parent.children, function (child) {
      child.parent = parent;
      angular.forEach(child.children, function (subChild) {
        subChild.parent = child;
      });
    });
  });

  angular.element(document).ready(function () {
    $scope.parents = DataService.getData();
    $scope.$apply();
  });
});
