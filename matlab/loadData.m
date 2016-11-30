function [data] = loadData(filePath)

  if(contains(filePath, '.set'))

    data = pop_loadset('filePath');

  else

    data = sload('filePath');

  end

end
