export default function getData({oldData}) {
    const modules=[{
        importer: "import { CacheModule } from './common/cache/cache.module'",
        moduleName:"CacheModule",
    },{
        importer: "import { CacheModule as CacheModuleDemo } from './examples/cache/cache.module'",
        moduleName: "CacheModuleDemo",
    }]
    return {
        ...oldData,
        modules: [...(oldData?.modules??[]),...modules],
    };
}