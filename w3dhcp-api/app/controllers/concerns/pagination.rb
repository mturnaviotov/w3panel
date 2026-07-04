module Pagination
  extend ActiveSupport::Concern

  def render_paginated(relation, options = {})
    if params[:pagination] == 'false' || params[:per_page] == '-1'
      serializer = options[:each_serializer] || ActiveModel::Serializer::CollectionSerializer
      data = if options[:each_serializer]
               ActiveModel::Serializer::CollectionSerializer.new(relation, serializer: serializer, scope: current_user, scope_name: :current_user)
             else
               ActiveModel::Serializer::CollectionSerializer.new(relation, scope: current_user, scope_name: :current_user)
             end
      return render json: data
    end

    total = relation.count
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i
    
    paginated_relation = relation.offset((page - 1) * per_page).limit(per_page)

    serializer = options[:each_serializer] || ActiveModel::Serializer::CollectionSerializer
    
    data = if options[:each_serializer]
             ActiveModel::Serializer::CollectionSerializer.new(paginated_relation, serializer: serializer, scope: current_user, scope_name: :current_user)
           else
             ActiveModel::Serializer::CollectionSerializer.new(paginated_relation, scope: current_user, scope_name: :current_user)
           end

    render json: {
      data: data,
      meta: { total: total }
    }
  end
end
