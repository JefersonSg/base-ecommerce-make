import * as createBanner from './create'
import * as removeById from './deleteById'
import * as getAll from './getAll'
import * as update from './update'
import * as validationBanner from './validationBanner'
import * as getAllActives from './getAllActives'

export const BannersControl = {
    ...createBanner,
    ...removeById,
    ...getAll,
    ...getAllActives,
    ...update,
    ...validationBanner,
}