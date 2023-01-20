import { declareModule, makeFunctionalArtModule } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../package.json';

declareModule(
  makeFunctionalArtModule({
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

 // TODO: !!! Implement



        });
