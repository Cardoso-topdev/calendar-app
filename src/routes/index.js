import { ExpandMore } from "@material-ui/icons";
import { Navigate } from "react-router";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ExamEditPage from "../pages/admin/ExamEditPage";
import ExamsPage from "../pages/admin/ExamsPage";
import StudentsPage from "../pages/admin/StudentsPage";
import TasksPage from "../pages/admin/TasksPage";
import TasktypesPage from "../pages/admin/TasktypesPage";
import SigninPage from "../pages/auth/SigninPage";
import CalendarPage from "../pages/calendar/calendarPage";

export const ROUTES = isAdmin => [
  {
    path: '/',
    element: <CalendarPage />,
    exact: true,
    text: "Calendar Page"
  },
  {
    path: '/signin',
    element: <SigninPage />,
    exact: true,
    text: "Sign In page"
  },
  {
    path: 'admin',
    element: isAdmin ? <AdminDashboard /> : <Navigate to="/signin"/>,
    exact: true,
    children : [
      {
        path: '/', element: <ExamsPage />, text: "Students Page"
      },
      // {
      //   path: 'students', element: <StudentsPage />, text: "Students Page"
      // },
      {
        path: 'tasks', element: <TasksPage />, text: "Tasks Page"
      },
      {
        path: 'tasktypes', element: <TasktypesPage />, text: "Task types Page"
      },
      {
        path: 'exams/edit', element: <ExamEditPage />, text: "Exam Edit Page"
      },
      {
        path: 'exams', element: <ExamsPage />, text: "Exams Page",
      }
    ]
  }
]