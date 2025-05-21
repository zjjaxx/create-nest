export default function getData({ oldData }) {
  const modules = [{
    importer: "import { AuthModule } from './common/auth/auth.module'",
    moduleName: "AuthModule",
  },
  {
    importer: "import { UserModule } from './examples/user/user.module'",
    moduleName: "UserModule",
  }
];
  return {
    ...oldData,
    modules: [...(oldData?.modules ?? []), ...modules],
  };
}
