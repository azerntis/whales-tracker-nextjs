declare module "*.less" {
  const resource: { [key: string]: string };
  export = resource;
}

interface Window {
  ethereum: any;
}
