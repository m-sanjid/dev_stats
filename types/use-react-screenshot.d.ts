declare module "use-react-screenshot" {
  export function useScreenshot(): [
    (element: HTMLElement) => Promise<string>,
    string | null,
  ];
}
