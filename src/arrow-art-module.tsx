import { declareModule, IAppearance, ISystems, makeFunctionalArtModule, React } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../package.json';

interface ArrowShape {}

interface ArrowAppearance extends IAppearance {
    // TODO:
}

declareModule(
    makeFunctionalArtModule<ArrowShape, ArrowAppearance>({
        manifest: {
            name: '@collboard-templates/freehand-with-dashpattern-tool',
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Drawing of dotted and dashed lines', cs: 'Kreslení přerušovaných čar' },
            categories: ['Basic', 'Art', 'Experimental'],
            icon: '✒️',
            flags: {
                isTemplate: true,
            },
        },

        createArt(artData) {
            const { shape, appearance, transform } = artData;

            return {
                shape,
                appearance,
                transform,
                render(isSelected: boolean, systems: ISystems) {
                    // TODO: !!! Implement
                    return <></>;
                },
            };
        },
    }),
);
