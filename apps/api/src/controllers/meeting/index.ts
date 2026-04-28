import { ById } from './by-id';
import { BySlug } from './by-slug';
import { Create } from './create';
import { Delete } from './delete';
import { Edit } from './edit';
import { Paginacao } from './paginacao';
import { RemoveFromGallery } from './remove-from-gallery';
import { UploadGallery } from './upload-gallery';

export class MeetingController {
    public readonly classId = Symbol.for('Controller > Meeting');

    public readonly paginacao: Paginacao;
    public readonly byId: ById;
    public readonly bySlug: BySlug;
    public readonly create: Create;
    public readonly delete: Delete;
    public readonly edit: Edit;
    public readonly uploadGallery: UploadGallery;
    public readonly removeFromGallery: RemoveFromGallery;

    constructor() {
        this.create = Create.construir( this.classId);
        this.paginacao = Paginacao.construir(this.classId);
        this.byId = ById.construir(this.classId);
        this.bySlug = BySlug.construir(this.classId);
        this.delete = Delete.construir(this.classId);
        this.edit = Edit.construir(this.classId);
        this.uploadGallery = UploadGallery.construir(this.classId);
        this.removeFromGallery = RemoveFromGallery.construir(this.classId);
    }
}
