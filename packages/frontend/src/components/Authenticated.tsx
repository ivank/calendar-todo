import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export const Authenticated: FC<PropsWithChildren> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? (
    children
  ) : (
    <div className="px-6 pt-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-28 sm:py-36 lg:py-48">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Developed in the open.{" "}
            <a
              href="https://github.com/ivank/calendar-todo"
              className="font-semibold text-gray-900"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              source code <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Stay on top of your work
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-900">
            Organize your todos for each day, repeat tasks or move them around
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/register" className="btn">
              Get started
            </Link>
            <Link to="/login" className="btn-text">
              Already have an account? Login <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
