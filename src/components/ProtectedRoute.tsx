import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useSession } from "../providers/useSession";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/", { replace: true });
    },
    [isAuthenticated, navigate],
  );

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;