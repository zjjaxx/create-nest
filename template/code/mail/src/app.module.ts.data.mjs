export default function getData({oldData}) {
    const modules=[{
        importer: "import { MailModule } from './common/mail/mail.module'",
        moduleName: "MailModule"
    },{
        importer: "import { MailModule as MailModuleDemo } from './examples/mail/mail.module'",
        moduleName: "MailModuleDemo",
    }]
    return {
        ...oldData,
        modules: [...(oldData?.modules??[]),...modules],
    };
}