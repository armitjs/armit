export type PackageItem = {
  name: string;
  version: string;
};

export type PackageGraph = {
  version: string;
  resolved?: string;
  dependencies?: Record<string, PackageGraph>;
};

export type PackageGraphRoot = {
  name: string;
  version: string;
  dependencies: Record<string, PackageGraph>;
};

export type VersionDepsGraph = {
  version: string;
  depsGraph: PackageItem[];
};

export type DetectedRiskInstallPackageItem = {
  name: string;
  data: {
    expectVersion: string;
    installedVersion: string;
    installedDepGrap: PackageItem[];
  };
};
