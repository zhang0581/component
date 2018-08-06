app.directive("sidebar",function (session) {
    return {
        restrict: "EA",
        replace: true,
        templateUrl: "js/directives/sidebar/sidebar.html",
        scope: {
            sidebarList: "="
        },
        link: function (scope) {
            // 刷新后保持高亮
            scope.level_1 = session.get("level_1");
            scope.level_2 = session.get("level_2");
            // 点击一级菜单
            scope.toggleList = function (x) {
                if (x === undefined) {
                    session.set("level_1", undefined);
                }
                scope.level_1 = (scope.level_1 == x) ? undefined : x;  // 点击只显示当前项，再次点击隐藏
            }
            // 点击二级菜单
            scope.currentList = function (y, parentIndex) {
                scope.level_2 = y;
                // 把当前点击的菜单信息存入sessionStorage中
                session.set("level_1", parentIndex);
                session.set("level_2", y);
            }
        }
    }
})