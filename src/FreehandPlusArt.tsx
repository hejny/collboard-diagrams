import { Abstract2dArt, classNames, declareModule, makeArtModule, React } from '@collboard/modules-sdk';
import { IVectorData, Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../package.json';
import { DASHPATTERNS } from './DashpatternAttribute';

export const SVG_PADDING = 0; /* <- TODO; TODO: !!! Remove */
export const IS_NEAR_DISTANCE = 20;

export class FreehandPlusArt extends Abstract2dArt {
    // TODO: Some clear rules how to name serializeName and module names (+ adding scopes and versions there)
    // TODO: How to handle versioning in arts?
    public static serializeName = 'FreehandPlus';
    public static manifest = {
        name: '@hejny/collboard-diagrams',
        contributors,
        description,
        license,
        repository,
        version,
    };

    private minX: number = 0;
    private maxX: number = 0;
    private minY: number = 0;
    private maxY: number = 0;

    public constructor(
        public path: IVectorData[],
        public color: string,
        public dashpattern: string,
        public weight: number,
    ) {
        super();
    }

    public get topLeft() {
        return new Vector(this.minX, this.minY).add(this.shift);
    }
    public get bottomRight() {
        return new Vector(this.maxX, this.maxY).add(this.shift);
    }
    public get size() {
        return this.bottomRight.subtract(this.topLeft);
    }
    public set size(newSize: Vector) {
        try {
            const scaleX = (newSize.x || 0) / (this.maxX - this.minX);
            const scaleY = (newSize.y || 0) / (this.maxY - this.minY);

            this.path.forEach((point) => {
                point.x = (point.x || 0) * scaleX;
                point.y = (point.y || 0) * scaleY;
            });
            this.calculateBoundingBox();
        } catch (e) {
            this.calculateBoundingBox();
        }
    }

    public isNear(point2: IVectorData) {
        return (
            this.path.filter((point) => Vector.add(point, this.shift).distance(point2) <= IS_NEAR_DISTANCE).length > 0
        );
    }

    public get acceptedAttributes() {
        return ['color', 'weight', 'size'];
    }

    private calculateBoundingBox() {
        const xVals = this.path.map((point) => point.x || 0);
        const yVals = this.path.map((point) => point.y || 0);
        this.minX = Math.min.apply(null, xVals);
        this.maxX = Math.max.apply(null, xVals);
        this.minY = Math.min.apply(null, yVals);
        this.maxY = Math.max.apply(null, yVals);
    }

    private get svgpath(): string {
        return this.path
            .map((point, i) => {
                const pointRelative = Vector.subtract(
                    point,
                    new Vector(this.minX - SVG_PADDING, this.minY - SVG_PADDING),
                );
                return `${i === 0 ? 'M' : 'L'}${pointRelative.x} ${pointRelative.y}`;
            })
            .join(' ');
    }

    render(selected: boolean) {
        this.calculateBoundingBox();
        return (
            <div
                className={classNames('art', selected && 'selected')}
                style={{
                    position: 'absolute',
                    left: this.minX - SVG_PADDING + (this.shift.x || 0),
                    top: this.minY - SVG_PADDING + (this.shift.y || 0),
                }}
            >
                <svg
                    width={this.maxX - this.minX + 2 * SVG_PADDING}
                    height={this.maxY - this.minY + 2 * SVG_PADDING}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ overflow: 'visible' }}
                >
                    <defs>
                        {/* @see http://thenewcode.com/1068/Making-Arrows-in-SVG */}
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="0"
                            refY="3.5"
                            orient="auto"
                            fill={this.color}
                        >
                            <polygon points="0 0, 10 3.5, 0 7" style={{ fill: this.color }} />
                        </marker>
                    </defs>
                    <g>
                        <path
                            d={this.svgpath}
                            stroke={this.color}
                            strokeWidth={this.weight}
                            fillOpacity="null"
                            strokeOpacity="null"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="transparent"
                            strokeDasharray={DASHPATTERNS[this.dashpattern].dasharray
                                .map((length) => length * this.weight)
                                .join(' ')}
                            markerEnd="url(#arrowhead)"
                        />
                    </g>
                </svg>
            </div>
        );
    }
}

declareModule(makeArtModule(FreehandPlusArt));
