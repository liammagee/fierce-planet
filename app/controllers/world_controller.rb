class WorldController < ApplicationController
  def open
    @level = Level.new
    if (params[:id])
      @level = Level.find(params[:id])
    end
    flash[:notice] = "Opening Level 1..."
  end

  def agent
    
  end

end
