export const chooseErrorImage = (errorNum?: number): string => {
  const errorNums = [400, 401, 403, 404, 500, 503];

  if (!errorNum || !errorNums.includes(errorNum))
    return "/pictures/error_boundary.png";

  switch (errorNum) {
    case 400:
      return "/pictures/error_400.png";
    case 401:
    case 403:
      return "/pictures/error_401_403.png";
    case 404:
      return "/pictures/error_404.png";
    case 500:
      return "/pictures/error_500.png";
    case 503:
      return "/pictures/error_503.png";
    default:
      return "/pictures/error_boundary.png";
  }
};
