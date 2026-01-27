import { PortfolioData } from "@/types";
import MinimalTemplate from "./minimal-template";
import ModernTemplate from "./modern-template";

export type TemplateType = 'minimal' | 'modern';

export default function TemplateRenderer({
    template,
    data
}: {
    template: TemplateType;
    data: PortfolioData
}) {
    switch (template) {
        case 'minimal':
            return <MinimalTemplate data={data} />;
        case 'modern':
            return <ModernTemplate data={data} />;
        default:
            return <MinimalTemplate data={data} />;
    }
}
