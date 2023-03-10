// Note: We are using library destroyable and xyzt which is published under @hejny (creator of Collboard) but probbly it should be also published under @collboard to make clear that it is an integral part of Collboard stack.
import { declareModule, makeIconModuleOnModule, React, Separator, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { contributors, description, license, repository, version } from '../../package.json';
import { FreehandAnimatedArt } from './freehand-animated-art-module';

declareModule(
    makeIconModuleOnModule({
        manifest: {
            name: '@hejny/freehand-animated-tool',
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Drawing of animated lines', cs: 'Kreslení pohyblivých čar' },
            categories: ['Basic', 'Art'],
            keywords: ['animace', 'lines', 'freehand', 'drawing', 'animation'],
            icon: '🌊',
        },
        toolbar: ToolbarName.Tools,
        async icon(systems) {
            const { attributesSystem } = await systems.request('attributesSystem');
            return {
                section: 2,
                icon: '🌊',
                boardCursor: 'crosshair',
                menu: () => (
                    <>
                        {attributesSystem.inputRender('weight')}
                        <Separator />
                        {attributesSystem.inputRender('color')}
                        <Separator />
                        {attributesSystem.inputRender('freehand-animation')}
                    </>
                ),
            };
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const { touchController, appState, attributesSystem, materialArtVersioningSystem, collSpace } =
                    await systems.request(
                        'touchController',
                        'appState',
                        'attributesSystem',
                        'materialArtVersioningSystem',
                        'collSpace',
                    );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        next: (touch) => {
                            appState.cancelSelection();

                            // TODO: On dashpattern = solid make classical freehand art (and figure out how to import it here).
                            const artInProcess = new FreehandAnimatedArt(
                                [],
                                attributesSystem.getAttributeValue('color').value as string,
                                attributesSystem.getAttributeValue('freehand-animation').value as string,
                                attributesSystem.getAttributeValue('weight').value as number,
                            );

                            const operation = materialArtVersioningSystem.createPrimaryOperation();
                            operation.newArts(artInProcess);

                            registerAdditionalSubscription(
                                touch.frames.subscribe({
                                    async next(touchFrame) {
                                        artInProcess.path.push((await collSpace.pickPoint(touchFrame.position)).point);
                                        operation.update(artInProcess);
                                    },
                                    complete() {
                                        operation.persist();
                                    },
                                }),
                            );
                        },
                    }),
                );
            },
        },
    }),
);
